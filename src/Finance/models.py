# -*- coding: utf-8 -*-
import logging
import sys
from decimal import Decimal

from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.core.validators import MinValueValidator
from django.db import models
from django.db import transaction
from django.utils import timezone
from jsonfield import JSONField

from Account.models import User
from Dic.conf import *
from Dic.models import CoinType
from .exceptions import *
from .manager import (
    DepositAddressManager, DepositBTCAddressManager,
    BalanceBTCManager, BalanceManager
)
from .signals import balance_history_logged

reload(sys)
sys.setdefaultencoding('utf-8')

logger = logging.getLogger(__name__)

# 选择项
COIN_TYPE_CHOICES = ((ct.id, ct.code) for ct in CoinType.objects.all())
BALANCE_FROZEN_STATUS_CHOICES = ((k, v) for (k, v) in DIC_FROZEN_STATUS.items())
BALANCE_UNFROZEN_STATUS_CHOICES = ((k, v) for (k, v) in DIC_UNFROZEN_STATUS.items())
BALANCE_CHARGE_STATUS_CHOICES = ((k, v) for (k, v) in DIC_CHARGE_STATUS.items())
BALANCE_WKC_CHARGE_STATUS_CHOICES = ((k, v) for (k, v) in DIC_WKC_CHARGE_STATUS.items())
BALANCE_WITHDRAW_STATUS_CHOICES = ((k, v) for (k, v) in DIC_WITHDRAW_STATUS.items())
BALANCE_TRANSFER_STATUS_CHOICES = ((k, v) for (k, v) in DIC_TRANSFER_STATUS.items())
BALANCE_FORWARD_STATUS_CHOICES = ((k, v) for (k, v) in DIC_FORWARD_STATUS.items())
BALANCE_DISPATCH_STATUS_CHOICES = ((k, v) for (k, v) in DIC_DISPATCH_STATUS.items())
BALANCE_FEE_STATUS_CHOICES = ((k, v) for (k, v) in DIC_FEE_STATUS.items())
FINANCE_TYPE_CHOICES = ((k, v) for (k, v) in DIC_FINANCE_TYPE.items())


# TODO 所有创建资金变动的方法可以用工厂方法来实现，减少代码冗余

# 资金余额
class Balances(models.Model):
    user = models.ForeignKey(User, related_name='balance', verbose_name='用户',
                             on_delete=models.CASCADE)
    coin_type = models.PositiveSmallIntegerField('币种', null=False, blank=False, default=1,
                                                 choices=COIN_TYPE_CHOICES)
    frozen = models.DecimalField('冻结', max_digits=30, decimal_places=8, default=0,
                                 validators=[MinValueValidator(0)])
    available = models.DecimalField('可用', max_digits=30, decimal_places=8, default=0,
                                    validators=[MinValueValidator(0)])
    unconfirmed = models.DecimalField('确认中', max_digits=30, decimal_places=8, default=0,
                                      validators=[MinValueValidator(0)])

    objects = BalanceManager()
    BTC = BalanceBTCManager()  # BTC余额

    def __unicode__(self):
        return '币种{}，可用：{}，冻结：{}，确认中：{}'.format(self.coin_type, self.available, self.frozen, self.unconfirmed)

    class Meta:
        unique_together = ('user', 'coin_type')
        verbose_name = '资金余额'
        verbose_name_plural = '资金余额'

    # 资金余额表应该只提供三种类型资金（frozen available unconfirmed）之间的相互转化和自身的变化的原子操作
    # 资金变化由相关的订单引发，对资金的操作在相应的订单里面处理，并有相应的history来记录状态变化情况
    #
    # 三种类型资金变化状态图：
    # available   ---> frozen       资金被冻结，比如下单、申请提现
    # frozen      ---> available    资金被解冻，比如撤单、撤消提现
    # unconfirmed ---> available    资金充值
    # available   ---> unconfirmed  充值的资金订单被取消
    # frozen      直接变化           冻结资金被使用，比如提现成功、发生交易
    # available   直接变化           可用资金被使用，比如发生交易
    # unconfirmed 直接变化           确认中资金变化，比如充币订单确认中

    # available ---> frozen       资金被冻结，比如下单、申请提现
    # available减少amount，frozen增加amount
    # obj   为引起资金变化的对象，比如充值订单、提现订单、ICO订单等
    # extra 为额外的一些参数，以字典类型表达
    def available_to_frozen(self, amount, fee, category, reason, obj=None, extra=None):
        with transaction.atomic():
            balance = Balances.objects.select_for_update().get(pk=self.pk)
            if balance.available < amount:
                raise BalanceFrozenException('资金冻结失败：用户{}, 币种{}，余额{}，需冻结{}'.format(
                    balance.user_id, balance.coin_type, balance.available, amount))

            balance.available -= amount
            balance.frozen += amount
            balance.save()
            log_balance_history(balance, 'AVAILABLE_TO_FROZEN', amount, fee, category, reason, obj, extra)

    # frozen ---> available    资金被解冻，比如撤单、撤消提现
    # frozen减少amount，available增加amount
    # obj   为引起资金变化的对象，比如充值订单、提现订单、ICO订单等
    # extra 为额外的一些参数，以字典类型表达
    def frozen_to_available(self, amount, fee, category, reason, obj=None, extra=None):
        with transaction.atomic():
            balance = Balances.objects.select_for_update().get(pk=self.pk)
            if balance.frozen < amount:
                raise BalanceUnfrozenException('资金解冻失败：用户{}, 币种{}，已冻结{}，需解冻{}'.format(
                    balance.user_id, balance.coin_type, balance.frozen, amount))

            balance.available += amount
            balance.frozen -= amount
            balance.save()
            log_balance_history(balance, 'FROZEN_TO_AVAILABLE', amount, fee, category, reason, obj, extra)

    # unconfirmed ---> available    资金充值
    # unconfirmed减少amount，available增加amount
    # obj   为引起资金变化的对象，比如充值订单、提现订单、ICO订单等
    # extra 为额外的一些参数，以字典类型表达
    def unconfirmed_to_available(self, amount, fee, category, reason, obj=None, extra=None):
        with transaction.atomic():
            balance = Balances.objects.select_for_update().get(pk=self.pk)
            if balance.unconfirmed < amount:
                raise BalanceConfirmException('资金确认失败：用户{}, 币种{}，待确认{}，需确认{}'.format(
                    balance.user_id, balance.coin_type, balance.unconfirmed, amount))

            balance.available += amount
            balance.unconfirmed -= amount
            balance.save()
            log_balance_history(balance, 'UNCONFIRMED_TO_AVAILABLE', amount, fee, category, reason, obj, extra)

    # available ---> unconfirmed  充值的资金订单被取消（因为区块的分叉）
    # available减少amount，unconfirmed增加amount
    # obj   为引起资金变化的对象，比如充值订单、提现订单、ICO订单等
    # extra 为额外的一些参数，以字典类型表达
    def available_to_unconfirmed(self, amount, fee, category, reason, obj=None, extra=None):
        with transaction.atomic():
            balance = Balances.objects.select_for_update().get(pk=self.pk)
            if balance.available < amount:
                raise BalanceConfirmException('资金取消失败：用户{}, 币种{}，余额{}，需取消{}'.format(
                    balance.user_id, balance.coin_type, balance.available, amount))

            balance.available -= amount
            balance.unconfirmed += amount
            balance.save()
            log_balance_history(balance, 'AVAILABLE_TO_UNCONFIRMED', amount, fee, category, reason, obj, extra)

    # frozen直接变化           冻结资金被使用，比如提现成功、发生交易
    # frozen增加amount
    # obj   为引起资金变化的对象，比如充值订单、提现订单、ICO订单等
    # extra 为额外的一些参数，以字典类型表达
    def modify_frozen(self, amount, fee, category, reason, obj=None, extra=None):
        with transaction.atomic():
            balance = Balances.objects.select_for_update().get(pk=self.pk)
            if balance.frozen + amount < 0:
                raise BalanceFrozenException('修改冻结失败：用户{}, 币种{}，已冻结{}，需修改{}'.format(
                    balance.user_id, balance.coin_type, balance.frozen, amount))

            balance.frozen += amount
            balance.save()
            log_balance_history(balance, 'MODIFY_FROZEN', amount, fee, category, reason, obj, extra)

    # available直接变化           可用资金被使用，比如发生交易
    # available增加amount
    # obj   为引起资金变化的对象，比如充值订单、提现订单、ICO订单等
    # extra 为额外的一些参数，以字典类型表达
    def modify_available(self, amount, fee, category, reason, obj=None, extra=None):
        with transaction.atomic():
            balance = Balances.objects.select_for_update().get(pk=self.pk)
            if balance.available + amount < 0:
                raise BalanceModifyException('修改余额失败：用户{}, 币种{}，余额{}，需修改{}'.format(
                    balance.user_id, balance.coin_type, balance.available, amount))

            balance.available += amount
            balance.save()
            log_balance_history(balance, 'MODIFY_AVAILABLE', amount, fee, category, reason, obj, extra)

    # unconfirmed直接变化           确认中资金变化，比如充币订单确认中
    # unconfirmed增加amount
    # obj   为引起资金变化的对象，比如充值订单、提现订单、ICO订单等
    # extra 为额外的一些参数，以字典类型表达
    def modify_unconfirmed(self, amount, fee, category, reason, obj=None, extra=None):
        with transaction.atomic():
            balance = Balances.objects.select_for_update().get(pk=self.pk)
            if balance.unconfirmed + amount < 0:
                raise BalanceModifyException('修改待确认失败：用户{}, 币种{}，待确认{}，需修改{}'.format(
                    balance.user_id, balance.coin_type, balance.unconfirmed, amount))

            balance.unconfirmed += amount
            balance.save()
            log_balance_history(balance, 'MODIFY_UNCONFIRMED', amount, fee, category, reason, obj, extra)


# 资金变化历史，用于显示财务详情
# 根据category显示不同类别的财务详情，记录该类财务的某个订单的财务详细变化情况
class BalanceHistory(models.Model):
    balance = models.ForeignKey(Balances, related_name='history', verbose_name='资金余额',
                                null=True, on_delete=models.SET_NULL)
    timestamp = models.DateTimeField('变动时间', default=timezone.now, db_index=True)
    action = models.CharField('状态变化', max_length=50, db_index=True)
    content_type = models.ForeignKey(ContentType, verbose_name='订单类型', null=True, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField('订单编号', null=True)
    obj = GenericForeignKey("content_type", "object_id")
    extra = JSONField()

    amount = models.DecimalField('变动金额', max_digits=30, decimal_places=8, null=False, blank=False, default=0)
    fee = models.DecimalField('变动手续费', max_digits=30, decimal_places=8, null=False, blank=False, default=0)
    frozen = models.DecimalField('变动后的冻结金额', max_digits=30, decimal_places=8, default=0,
                                 validators=[MinValueValidator(0)])
    available = models.DecimalField('变动后的可用金额', max_digits=30, decimal_places=8, default=0,
                                    validators=[MinValueValidator(0)])
    unconfirmed = models.DecimalField('变动后的确认中金额', max_digits=30, decimal_places=8, default=0,
                                      validators=[MinValueValidator(0)])
    category = models.PositiveSmallIntegerField('变动类别', default=0)
    reason = models.CharField('变动原因说明', max_length=255, null=True)

    class Meta:
        verbose_name = '资金变化历史'
        verbose_name_plural = '资金变化历史'
        ordering = ["-timestamp"]


# 记录资金变化历史
# obj   为引起资金变化的对象，比如充值订单、提现订单、ICO订单等
# extra 为额外的一些参数，以字典类型表达
def log_balance_history(balance, action, amount, fee, category, reason, obj=None, extra=None, dateof=None):
    if extra is None:
        extra = {}
    content_type = None
    object_id = None

    if obj is not None:
        content_type = ContentType.objects.get_for_model(obj)
        object_id = obj.pk

    if dateof is None:
        dateof = timezone.now()

    event = BalanceHistory.objects.create(
        balance=balance,
        action=action,
        extra=extra,
        content_type=content_type,
        object_id=object_id,
        timestamp=dateof,
        amount=amount,
        fee=fee,
        category=category,
        reason=reason,
        unconfirmed=balance.unconfirmed,
        available=balance.available,
        frozen=balance.frozen
    )

    balance_history_logged.send(sender=BalanceHistory, event=event)
    return event


# 财务记录表，涵盖与财务有关的订单（包括ICO订单、交易订单）
class BalanceLog(models.Model):
    user = models.ForeignKey(User, related_name='balancelog', verbose_name='用户',
                             on_delete=models.CASCADE)
    coin_type = models.PositiveSmallIntegerField('币种', null=False, blank=False, default=1,
                                                 choices=COIN_TYPE_CHOICES)
    finance_type = models.PositiveSmallIntegerField('订单类型', null=False, blank=False,
                                                    default=0, choices=FINANCE_TYPE_CHOICES)
    timestamp = models.DateTimeField(default=timezone.now, db_index=True)

    order_type = models.ForeignKey(ContentType, null=True, on_delete=models.CASCADE)
    order_id = models.PositiveIntegerField(null=True)
    order = GenericForeignKey("order_type", "order_id")

    class Meta:
        verbose_name = '财务记录'
        verbose_name_plural = '财务记录'


# 创建财务记录
def create_balance_log(user, coin_type, finance_type, order):
    order_type = None
    order_id = None
    if order is not None:
        order_type = ContentType.objects.get_for_model(order)
        order_id = order.pk

    obj = BalanceLog.objects.create(
        user=user,
        coin_type=coin_type,
        finance_type=finance_type,
        timestamp=order.create_time,
        order_type=order_type,
        order_id=order_id
    )
    return obj


# 充币地址
class DepositAddress(models.Model):
    user = models.ForeignKey(User, related_name='deposit_address', verbose_name='用户',
                             on_delete=models.CASCADE)
    address = models.CharField('充值地址', max_length=255, null=False, blank=False, db_index=True)
    label = models.CharField('备注', max_length=255, null=False, blank=False)
    coin_type = models.PositiveSmallIntegerField('币种', null=False, blank=False, default=1,
                                                 choices=COIN_TYPE_CHOICES)
    create_time = models.DateTimeField('创建时间', default=timezone.now)
    is_active = models.BooleanField('是否有效', default=True)

    objects = DepositAddressManager()
    BTCAddress = DepositBTCAddressManager()

    def __unicode__(self):
        return self.address

    class Meta:
        verbose_name = '用户充值地址'
        verbose_name_plural = '用户充值地址'


# 资金充值订单表
class BalanceCharge(models.Model):
    address = models.ForeignKey(DepositAddress, related_name='charge', verbose_name='充值地址',
                                on_delete=models.CASCADE)
    create_time = models.DateTimeField('到账时间', null=False, blank=False, default=timezone.now)
    amount = models.DecimalField('到账金额', max_digits=30, decimal_places=8, null=False, blank=False)

    # 充值交易（根据不同币种填不同的交易id）
    tx_type = models.ForeignKey(ContentType, null=True, on_delete=models.CASCADE)
    tx_id = models.PositiveIntegerField(null=True)
    tx = GenericForeignKey("tx_type", "tx_id")

    txid = models.CharField('交易ID', max_length=255, null=True)

    update_time = models.DateTimeField('最近更新时间', auto_now=True)
    status = models.PositiveSmallIntegerField('充值状态', null=False, blank=False, default=0,
                                              choices=BALANCE_CHARGE_STATUS_CHOICES)

    class Meta:
        verbose_name = '资金充值'
        verbose_name_plural = '资金充值'
        ordering = ["-create_time"]

    # 充值的三种状态之间相互转化

    # 0-确认中 --> 1-已确认，收到足够多的确认数以后发生
    def confirm(self):
        if self.status != 0:
            raise BalanceChargeException('资金不处于确认中状态：地址{}，金额{}'.format(
                self.address_id, self.amount
            ))

        try:
            with transaction.atomic():
                balance = Balances.objects.get(user=self.address.user, coin_type=self.address.coin_type)
                extra = {'user_id': self.address.user_id, 'coin_type': self.address.coin_type,
                         'addr': self.address.address, 'txid': self.txid}
                balance.unconfirmed_to_available(amount=self.amount, fee=0, category=1, reason="充值已确认",
                                                 obj=self, extra=extra)
                BalanceCharge.objects.select_for_update().filter(pk=self.pk).update(status=1,
                                                                                    update_time=timezone.now())
        except Exception as e:
            logger.error('资金充值确认失败：{0}'.format(e))
            raise e

    # 1-已确认 --> 0-确认中，由于区块链分叉导致交易未被确认
    def unconfirm(self):
        if self.status != 1:
            raise BalanceChargeException('资金不处于已确认状态：地址{}，金额{}'.format(
                self.address_id, self.amount
            ))

        try:
            with transaction.atomic():
                balance = Balances.objects.get(user=self.address.user, coin_type=self.address.coin_type)
                extra = {'user_id': self.address.user_id, 'coin_type': self.address.coin_type,
                         'addr': self.address.address, 'txid': self.txid}
                balance.available_to_unconfirmed(amount=self.amount, fee=0, category=2, reason="充值已取消",
                                                 obj=self, extra=extra)
                BalanceCharge.objects.select_for_update().filter(pk=self.pk).update(status=0,
                                                                                    update_time=timezone.now())
        except Exception as e:
            logger.error('资金充值取消失败：{0}'.format(e))
            raise e


# 创建资金充值记录
def create_balance_charge(coin_type, address, amount, tx=None, status=0):
    try:
        addr = DepositAddress.objects.get(coin_type=coin_type, address=address)

        tx_type = None
        tx_id = None
        txid = None
        if tx is not None:
            tx_type = ContentType.objects.get_for_model(tx)
            tx_id = tx.pk
            txid = tx.txid

        with transaction.atomic():
            obj, created = BalanceCharge.objects.get_or_create(
                address=addr,
                amount=amount,
                tx_type=tx_type,
                tx_id=tx_id,
                txid=txid,
                status=status
            )

            if created:
                create_balance_log(addr.user, addr.coin_type, 0, obj)

            balance = Balances.objects.get(user=addr.user, coin_type=addr.coin_type)
            extra = {'user_id': addr.user_id, 'coin_type': coin_type,
                     'addr': address, 'txid': tx.txid}
            if status == 0:  # 确认中
                balance.modify_unconfirmed(amount=amount, fee=0, category=0, reason="充值确认中", obj=obj, extra=extra)
            elif status == 1:  # 已确认
                balance.modify_available(amount=amount, fee=0, category=1, reason="充值已确认", obj=obj, extra=extra)
            elif status == 2:  # TODO 已撤消
                pass
        return obj
    except Exception as e:
        logger.error("创建资金充值记录失败：{0}".format(e))
        raise e


# WKC充值订单
class WKCBalanceCharge(models.Model):
    user = models.ForeignKey(User, related_name='wkc_charge', verbose_name='用户',
                             on_delete=models.CASCADE)
    address = models.CharField('转出地址', max_length=255, null=False, blank=False, db_index=True)
    amount = models.DecimalField('充值数量', max_digits=30, decimal_places=8, null=False, blank=False)
    create_time = models.DateTimeField('创建时间', default=timezone.now)
    update_time = models.DateTimeField('最近更新时间', auto_now=True)
    status = models.PositiveSmallIntegerField('充值状态', null=False, blank=False, default=0,
                                              choices=BALANCE_WKC_CHARGE_STATUS_CHOICES)

    # 状态值：0-待确认，1-已撤销，2-确认成功，3-确认失败

    # 取消充值订单
    def cancel(self):
        if self.status != 0:
            raise BalanceChargeException('资金不处于待确认状态：地址{}，金额{}'.format(
                self.address, self.amount
            ))
        WKCBalanceCharge.objects.select_for_update().filter(pk=self.pk).update(status=1)

    # 确认充值订单，由管理后台调用，用户充值成功
    # 默认充值数量等于订单中的数量，也可以通过amount参数来修改确认的数量
    def confirm(self, amount=None):
        if self.status != 0:
            raise BalanceChargeException('资金不处于待确认状态：地址{}，金额{}'.format(
                self.address, self.amount
            ))

        if amount is not None and Decimal(str(amount)) > 0:
            self.amount = amount

        coin_type = 6
        addr = DepositAddress.objects.get(user=self.user, coin_type=coin_type)
        tx_type = ContentType.objects.get_for_model(self)
        tx_id = self.pk
        txid = None
        status = 1  # 已确认

        with transaction.atomic():
            obj, created = BalanceCharge.objects.get_or_create(
                address=addr,
                amount=self.amount,
                tx_type=tx_type,
                tx_id=tx_id,
                txid=txid,
                status=status
            )

            if created:
                create_balance_log(self.user, coin_type, 0, obj)

            balance = Balances.objects.get(user=self.user, coin_type=coin_type)
            extra = {'user_id': self.user_id, 'coin_type': coin_type,
                     'addr': self.address, 'txid': txid}
            balance.modify_available(amount=self.amount, fee=0, category=1, reason="充值已确认", obj=obj, extra=extra)
            self.status = 2
            self.save()
        return obj

    # 充值订单确认错误，取消确认
    def cancel_confirm(self):
        if self.status != 2:
            raise BalanceChargeException('资金不处于已确认状态：地址{}，金额{}'.format(
                self.address, self.amount
            ))

        coin_type = 6
        tx_type = ContentType.objects.get_for_model(self)
        tx_id = self.pk
        txid = None

        with transaction.atomic():
            obj = BalanceCharge.objects.get(tx_type=tx_type, tx_id=tx_id)
            obj.status = 2
            obj.save()

            self.status = 1
            self.save()

            balance = Balances.objects.get(user=self.user, coin_type=coin_type)
            extra = {'user_id': self.user_id, 'coin_type': coin_type,
                     'addr': self.address, 'txid': txid}
            balance.modify_available(amount=-self.amount, fee=0, category=2, reason="充值已取消", obj=obj, extra=extra)

    # 充值订单对不上，由管理后台调用，用户充值失败
    def fail(self):
        if self.status != 0:
            raise BalanceChargeException('资金不处于待确认状态：地址{}，金额{}'.format(
                self.address, self.amount
            ))
        WKCBalanceCharge.objects.select_for_update().filter(pk=self.pk).update(status=3)

    def __unicode__(self):
        return self.address

    class Meta:
        verbose_name = '玩客币充值订单'
        verbose_name_plural = '玩客币充值订单'


# 创建玩客币充值订单
def create_wkc_charge(user, address, amount):
    obj = WKCBalanceCharge.objects.create(
        user=user,
        address=address,
        amount=amount
    )
    return obj


# 提币地址
class WithdrawAddress(models.Model):
    user = models.ForeignKey(User, related_name='withdraw_address', verbose_name='用户',
                             on_delete=models.CASCADE)
    address = models.CharField('提币地址', max_length=255, null=False, blank=False, db_index=True)
    label = models.CharField('备注', max_length=255, null=False, blank=False)
    coin_type = models.PositiveSmallIntegerField('币种', null=False, blank=False, default=1,
                                                 choices=COIN_TYPE_CHOICES)
    create_time = models.DateTimeField('创建时间', default=timezone.now)
    update_time = models.DateTimeField('最近更新时间', auto_now=True)
    is_active = models.NullBooleanField('是否有效', null=True, default=True)
    is_verified = models.BooleanField('是否安全认证', default=False)

    def __unicode__(self):
        return self.address

    class Meta:
        unique_together = (('user', 'coin_type', 'address', 'is_active'), ('user', 'label', 'is_active'),)
        verbose_name = '用户提现地址'
        verbose_name_plural = '用户提现地址'


# 币种提现属性
class CoinTypeProperty(models.Model):
    coin_type = models.PositiveSmallIntegerField('币种', null=False, blank=False, default=1,
                                                 choices=COIN_TYPE_CHOICES)
    withdraw_fee = models.DecimalField('提币手续费', max_digits=30, decimal_places=8, null=False, blank=False)
    single_limit = models.DecimalField('单笔限额', max_digits=30, decimal_places=8, null=False, blank=False)
    day_limit = models.DecimalField('单日限额', max_digits=30, decimal_places=8, null=False, blank=False)
    low_limit = models.DecimalField('最低提现数量', max_digits=30, decimal_places=8, null=False, blank=False)

    def __unicode__(self):
        return '币种属性'

    class Meta:
        verbose_name = '币种属性'
        verbose_name_plural = '币种属性'


# 资金提现订单表
class BalanceWithDraw(models.Model):
    address = models.ForeignKey(WithdrawAddress, related_name='withdraw', verbose_name='提现地址',
                                on_delete=models.CASCADE)
    create_time = models.DateTimeField('提现时间', null=False, blank=False, default=timezone.now)
    amount = models.DecimalField('提现金额', max_digits=30, decimal_places=8, null=False, blank=False)
    fee = models.DecimalField('手续费', max_digits=30, decimal_places=8, null=False, blank=False, default=0)
    # actual_amount = amount - fee
    actual_amount = models.DecimalField('到账金额', max_digits=30, decimal_places=8)

    # TODO 提现信息（财务人员转账后，由财务人员填写？）
    txid = models.CharField('交易id', max_length=255, null=True)

    update_time = models.DateTimeField('最近更新时间', auto_now=True)
    status = models.PositiveSmallIntegerField('提现状态', null=False, blank=False, default=10,
                                              choices=BALANCE_WITHDRAW_STATUS_CHOICES)

    def __unicode__(self):
        return '提现记录'

    class Meta:
        verbose_name = '资金提现'
        verbose_name_plural = '资金提现'
        ordering = ["-create_time"]

    # 提现的几种状态之间的转化
    # 10: '审核中',
    # 11: '审核通过',
    # 12: '审核未通过',
    # 13: '已汇出',
    # 14: '已撤销'

    # 10-审核中 --> 11-审核通过
    def confirm(self):
        if self.status != 10:
            raise BalanceWithdrawException('资金不处于审核中状态：地址{}，金额{}'.format(
                self.address_id, self.amount))
        self.status = 11
        self.save()

    # 11-审核通过 --> 10-审核中
    def unconfirm(self):
        if self.status != 11:
            raise BalanceWithdrawException('资金不处于审核通过状态：地址{}，金额{}'.format(
                self.address_id, self.amount))
        self.status = 10
        self.save()

    # 10-审核中 --> 14-已撤销
    def cancel(self):
        if self.status != 10:
            raise BalanceWithdrawException('资金不处于审核中状态：地址{}，金额{}'.format(
                self.address_id, self.amount))

        try:
            with transaction.atomic():
                balance = Balances.objects.get(user=self.address.user, coin_type=self.address.coin_type)

                extra = {'user_id': self.address.user_id, 'coin_type': self.address.coin_type,
                         'addr': self.address.address}
                balance.frozen_to_available(amount=self.amount, fee=self.fee, category=14, reason="提现取消",
                                            obj=self, extra=extra)
                BalanceWithDraw.objects.select_for_update().filter(pk=self.pk).update(status=14,
                                                                                      update_time=timezone.now())
        except Exception as e:
            logger.error("撤销资金提现记录失败：{0}".format(e))
            raise e

    # 10-审核中 --> 12-审核未通过
    def fail(self):
        if self.status != 10:
            raise BalanceWithdrawException('资金不处于审核中状态：地址{}，金额{}'.format(
                self.address_id, self.amount))

        try:
            with transaction.atomic():
                balance = Balances.objects.get(user=self.address.user, coin_type=self.address.coin_type)
                extra = {'user_id': self.address.user_id, 'coin_type': self.address.coin_type,
                         'addr': self.address.address}
                balance.frozen_to_available(amount=self.amount, fee=self.fee, category=12, reason="提现审核失败",
                                            obj=self, extra=extra)
                BalanceWithDraw.objects.select_for_update().filter(pk=self.pk).update(status=12,
                                                                                      update_time=timezone.now())
        except Exception as e:
            logger.error("资金提现审核不通过失败：{0}".format(e))
            raise e

    # 11-审核通过 --> 13-已汇出
    def remit(self):
        if self.status != 11:
            raise BalanceWithdrawException('资金不处于审核通过状态：地址{}，金额{}'.format(
                self.address_id, self.amount))

        try:
            with transaction.atomic():
                balance = Balances.objects.get(user=self.address.user, coin_type=self.address.coin_type)
                extra = {'user_id': self.address.user_id, 'coin_type': self.address.coin_type,
                         'addr': self.address.address}
                balance.modify_frozen(amount=-self.amount, fee=self.fee, category=13, reason="提现已汇出",
                                      obj=self, extra=extra)
                BalanceWithDraw.objects.select_for_update().filter(pk=self.pk).update(status=13,
                                                                                      update_time=timezone.now())
        except Exception as e:
            logger.error("资金提现汇出失败：{0}".format(e))
            raise e


# 创建资金提现记录
def create_balance_withdraw(user, coin_type, address, amount, fee):
    try:
        addr = WithdrawAddress.objects.get(user=user, coin_type=coin_type, address=address, is_active=True)

        with transaction.atomic():
            obj = BalanceWithDraw.objects.create(
                address=addr,
                amount=amount,
                fee=fee,
                actual_amount=amount - fee,
            )
            create_balance_log(addr.user, addr.coin_type, 1, obj)
            balance = Balances.objects.get(user=addr.user, coin_type=addr.coin_type)
            extra = {'user_id': user.id, 'coin_type': coin_type, 'addr': address}
            balance.available_to_frozen(amount=amount, fee=fee, category=10, reason="提现申请",
                                        obj=obj, extra=extra)
        return obj
    except Exception as e:
        logger.error("创建资金提现记录失败：{0}".format(e))
        raise e


# 资金转账订单表，用于站内用户相互转账
class BalanceForward(models.Model):
    send_user = models.ForeignKey(User, related_name='balance_forward_send_user', verbose_name='发送用户',
                                  on_delete=models.CASCADE)
    recv_user = models.ForeignKey(User, related_name='balance_forward_recv_user', verbose_name='接收用户',
                                  on_delete=models.CASCADE)
    coin_type = models.PositiveSmallIntegerField('币种', null=False, blank=False, default=1,
                                                 choices=COIN_TYPE_CHOICES)
    create_time = models.DateTimeField('过户时间', null=False, blank=False, default=timezone.now)

    amount = models.DecimalField('过户金额', max_digits=30, decimal_places=8, null=False, blank=False)
    send_fee = models.DecimalField('发送手续费', max_digits=30, decimal_places=8, null=False, blank=False, default=0)
    recv_fee = models.DecimalField('接收手续费', max_digits=30, decimal_places=8, null=False, blank=False, default=0)

    update_time = models.DateTimeField('最近更新时间', auto_now=True)
    status = models.PositiveSmallIntegerField('转账状态', null=False, blank=False, default=0,
                                              choices=BALANCE_FORWARD_STATUS_CHOICES)

    class Meta:
        verbose_name = '资金转账'
        verbose_name_plural = '资金转账'
        ordering = ["-create_time"]

    # 0-已转账 --> 1-已取消， 转账取消需扣除手续费
    def cancel(self):
        if self.status != 0:
            raise BalanceForwardException('资金不是已转账状态：发送用户{}，接收用户，币种{}，金额{}'.format(
                self.send_user_id, self.recv_user_id, self.coin_type, self.amount))

        try:
            with transaction.atomic():
                send_balance = Balances.objects.get(user=self.send_user, coin_type=self.coin_type)
                recv_balance = Balances.objects.get(user=self.recv_user, coin_type=self.coin_type)
                extra = {'send_user_id': self.send_user.id, 'recv_user_id': self.recv_user.id,
                         'coin_type': self.coin_type}
                send_balance.modify_available(amount=(self.amount + self.send_fee), fee=self.send_fee, category=73,
                                              reason="转账支出取消", obj=self, extra=extra)
                if self.send_fee > 0:
                    create_balance_fee(self.send_user, self.coin_type, self.send_fee, self)

                recv_balance.modify_available(amount=(-self.amount + self.recv_fee), fee=self.recv_fee, category=72,
                                              reason="转账收入取消", obj=self, extra=extra)
                if self.recv_fee > 0:
                    create_balance_fee(self.recv_user, self.coin_type, self.recv_fee, self)

                BalanceForward.objects.select_for_update().filter(pk=self.pk).update(status=1,
                                                                                     update_time=timezone.now())
        except Exception as e:
            logger.error('取消资金过户失败：{0}'.format(e))
            raise e

    # 1-已取消 --> 0-已转账
    def forward(self):
        if self.status != 1:
            raise BalanceForwardException('资金不是已取消状态：发送用户{}，接收用户，币种{}，金额{}'.format(
                self.send_user_id, self.recv_user_id, self.coin_type, self.amount))

        try:
            with transaction.atomic():
                send_balance = Balances.objects.get(user=self.send_user, coin_type=self.coin_type)
                recv_balance = Balances.objects.get(user=self.recv_user, coin_type=self.coin_type)
                extra = {'send_user_id': self.send_user.id, 'recv_user_id': self.recv_user.id,
                         'coin_type': self.coin_type}
                send_balance.modify_available(amount=(-self.amount - self.send_fee), fee=self.send_fee, category=71,
                                              reason="转账支出", obj=self, extra=extra)
                if self.send_fee > 0:
                    create_balance_fee(self.send_user, self.coin_type, -self.send_fee, self)

                recv_balance.modify_available(amount=(self.amount - self.recv_fee), fee=self.recv_fee, category=70,
                                              reason="转账收入", obj=self, extra=extra)
                if self.recv_fee > 0:
                    create_balance_fee(self.recv_user, self.coin_type, -self.recv_fee, self)
                BalanceTransfer.objects.select_for_update().filter(pk=self.pk).update(status=0,
                                                                                      update_time=timezone.now())
        except Exception as e:
            logger.error('资金过户失败：{0}'.format(e))
            raise e


# 创建资金转账订单
# 发送手续费send_fee，amount中不包含手续费
# 接收手续费recv_fee，amount中包含了手续费
def create_balance_forward(send_user, recv_user, coin_type, amount, send_fee=0, recv_fee=0):
    try:
        with transaction.atomic():
            obj = BalanceForward.objects.create(
                send_user=send_user,
                recv_user=recv_user,
                coin_type=coin_type,
                amount=amount,
                send_fee=send_fee,
                recv_fee=recv_fee
            )

            create_balance_log(send_user, coin_type, 7, obj)

            # 发送账户
            send_balance, _ = Balances.objects.get_or_create(user=send_user, coin_type=coin_type)
            extra = {'send_user': send_user.id, 'recv_user': recv_user.id,
                     'coin_type': coin_type}
            send_balance.modify_available(amount=(-amount - send_fee), fee=send_fee, category=71, reason="转账支出",
                                          obj=obj, extra=extra)
            # 手续费记账
            if send_fee > 0:
                create_balance_fee(send_user, coin_type, -send_fee, obj)

            # 接收账户
            recv_balance, _ = Balances.objects.get_or_create(user=recv_user, coin_type=coin_type)
            create_balance_log(recv_user, coin_type, 7, obj)
            extra = {'send_user': send_user.id, 'recv_user': recv_user.id,
                     'coin_type': coin_type}
            recv_balance.modify_available(amount=(amount - recv_fee), fee=recv_fee, category=70, reason="转账收入",
                                          obj=obj, extra=extra)
            # 手续费记账
            if recv_fee > 0:
                create_balance_fee(recv_user, coin_type, -recv_fee, obj)

        return obj
    except Exception as e:
        logger.error("创建资金转账记录失败：{0}".format(e))
        raise e


# 资金发放表，比如ICO认购成功、快照领币
class BalanceDispatch(models.Model):
    user = models.ForeignKey(User, related_name='balancedispatch', verbose_name='用户',
                             on_delete=models.CASCADE)
    coin_type = models.PositiveSmallIntegerField('币种', null=False, blank=False, default=1,
                                                 choices=COIN_TYPE_CHOICES)
    create_time = models.DateTimeField('到账时间', null=False, blank=False, default=timezone.now)
    amount = models.DecimalField('到账金额', max_digits=30, decimal_places=8, null=False, blank=False)
    # 发放交易（由于哪一个ICO交易引起的资金发放）
    tx_type = models.ForeignKey(ContentType, null=True, on_delete=models.CASCADE)
    tx_id = models.PositiveIntegerField(null=True)
    update_time = models.DateTimeField('最近更新时间', auto_now=True)
    status = models.PositiveSmallIntegerField('发放状态', null=False, blank=False, default=20,
                                              choices=BALANCE_DISPATCH_STATUS_CHOICES)

    class Meta:
        verbose_name = '资金发放'
        verbose_name_plural = '资金发放'
        ordering = ["-create_time"]

    # 0-已发放 --> 1-已取消
    def cancel(self):
        if self.status != 0:
            raise BalanceDispatchException('资金未处于已发放状态：用户{}，币种{}，金额{}'.format(
                self.user_id, self.coin_type, self.amount))

        try:
            with transaction.atomic():
                balance = Balances.objects.get(user=self.user, coin_type=self.coin_type)
                extra = {'user': self.user_id, 'coin_type': self.coin_type}
                balance.modify_available(amount=-self.amount, fee=0, category=31, reason='资金发放取消',
                                         obj=self, extra=extra)
                BalanceDispatch.objects.select_for_update().filter(pk=self.pk).update(status=1,
                                                                                      update_time=timezone.now())
        except Exception as e:
            logger.error('取消资金发放失败：{0}'.format(e))
            raise e

    # 1-已取消 --> 0-已发放
    def dispatch(self):
        if self.status != 1:
            raise BalanceDispatchException('资金未处于已取消状态：用户{}，币种{}，金额{}'.format(
                self.user_id, self.coin_type, self.amount))

        try:
            with transaction.atomic():
                balance = Balances.objects.get(user=self.user, coin_type=self.coin_type)
                extra = {'user': self.user_id, 'coin_type': self.coin_type}
                balance.modify_available(amount=self.amount, fee=0, category=30, reason='资金发放',
                                         obj=self, extra=extra)
                BalanceDispatch.objects.select_for_update().filter(pk=self.pk).update(status=0,
                                                                                      update_time=timezone.now())
        except Exception as e:
            logger.error('确认资金发放失败：{0}'.format(e))
            raise e


# 创建资金发放记录
def create_balance_dispatch(user, coin_type, amount, tx=None):
    try:
        tx_type = None
        tx_id = None
        if tx is not None:
            tx_type = ContentType.objects.get_for_model(tx)
            tx_id = tx.pk

        with transaction.atomic():
            obj = BalanceDispatch.objects.create(
                user=user,
                coin_type=coin_type,
                amount=amount,
                tx_type=tx_type,
                tx_id=tx_id
            )
            balance, created = Balances.objects.get_or_create(user=user, coin_type=coin_type)
            extra = {'user': user.id, 'coin_type': coin_type}
            create_balance_log(user, coin_type, 2, obj)
            balance.modify_available(amount=amount, fee=0, category=30, reason='资金发放', obj=obj, extra=extra)

        return obj
    except Exception as e:
        logger.error("创建资金发放记录失败：{0}".format(e))
        raise e


# 手续费表，记录收取得到的手续费（仅仅用于记账，供后台查看）
class BalanceFee(models.Model):
    user = models.ForeignKey(User, related_name='balancefee', verbose_name='用户',
                             on_delete=models.CASCADE)
    coin_type = models.PositiveSmallIntegerField('币种', null=False, blank=False, default=1,
                                                 choices=COIN_TYPE_CHOICES)
    amount = models.DecimalField('金额', max_digits=30, decimal_places=8, null=False, blank=False)

    # 交易记录
    tx_type = models.ForeignKey(ContentType, null=True, on_delete=models.CASCADE)
    tx_id = models.PositiveIntegerField(null=True)

    create_time = models.DateTimeField('扣除时间', null=False, blank=False, default=timezone.now)
    update_time = models.DateTimeField('最近更新时间', auto_now=True)
    status = models.PositiveSmallIntegerField('扣除状态', null=False, blank=False, default=0,
                                              choices=BALANCE_FEE_STATUS_CHOICES)

    class Meta:
        verbose_name = '手续费'
        verbose_name_plural = '手续费'
        ordering = ["-create_time"]

    # 0-已扣除 --> 1-已取消
    # def cancel(self):
    #     if self.status != 0:
    #         raise BalanceFeeException
    #     try:
    #         with transaction.atomic():
    #             balance = Balances.objects.get(user=self.user, coin_type=self.coin_type)
    #             extra = {'user': self.user_id, 'coin_type': self.coin_type,
    #                      'amount': self.amount}
    #             # TODO 需要具体看手续费返还到哪里
    #             balance.modify_available(self.amount, self, extra)
    #             BalanceFee.objects.select_for_update().filter(pk=self.pk).update(status=1, update_time=timezone.now())
    #     except Exception as e:
    #         logger.error('取消手续费扣除失败：{0}'.format(e))
    #         raise BalanceFeeException
    #
    # # 1-已取消 --> 0-已扣除
    # def dispatch(self):
    #     if self.status != 1:
    #         raise BalanceFeeException
    #     try:
    #         with transaction.atomic():
    #             balance = Balances.objects.get(user=self.user, coin_type=self.coin_type)
    #             extra = {'user': self.user_id, 'coin_type': self.coin_type,
    #                      'amount': self.amount}
    #             # TODO 目前设计的是从冻结资金中扣除手续费
    #             balance.modify_frozen(-self.amount, self, extra)
    #             BalanceFee.objects.select_for_update().filter(pk=self.pk).update(status=0, update_time=timezone.now())
    #     except Exception as e:
    #         logger.error('扣除手续费失败：{0}'.format(e))
    #         raise BalanceFeeException


# 创建手续费扣除记录，只记账不真实扣除
def create_balance_fee(user, coin_type, amount, tx=None):
    try:
        tx_type = None
        tx_id = None
        if tx is not None:
            tx_type = ContentType.objects.get_for_model(tx)
            tx_id = tx.pk

        with transaction.atomic():
            obj = BalanceFee.objects.create(
                user=user,
                coin_type=coin_type,
                amount=amount,
                tx_type=tx_type,
                tx_id=tx_id
            )
            # create_balance_log(user, coin_type, 4, obj)

        return obj
    except Exception as e:
        logger.error("创建手续费扣除记录失败：{0}".format(e))
        raise e


# 快照领币
class BTCSnapshot(models.Model):
    user = models.ForeignKey(User, related_name='btc_snapshot', verbose_name='用户',
                             on_delete=models.CASCADE)
    address = models.CharField('BTC地址', max_length=255, null=False, blank=False, db_index=True)
    balance = models.DecimalField('余额', max_digits=30, decimal_places=8, null=False, blank=False)
    coin_type = models.PositiveSmallIntegerField('领币币种', null=False, blank=False, default=4,
                                                 choices=COIN_TYPE_CHOICES)
    message = models.CharField('消息', max_length=255, default='Send Ulogos to Suiqiu')
    signature = models.CharField('签名', max_length=255, blank=False, null=False)
    create_time = models.DateTimeField('创建时间', default=timezone.now)
    is_active = models.BooleanField('是否有效', default=True)

    def __unicode__(self):
        return self.address

    class Meta:
        unique_together = ('address', 'coin_type')
        verbose_name = '快照领币'
        verbose_name_plural = '快照领币'


# 验证签名并发放ULOGOS和BITCOIN LOGO
def create_ulogos_dispatch(user, address, signature, balance, message='Send Ulogos to Suiqiu'):
    try:
        with transaction.atomic():
            obj = BTCSnapshot.objects.create(
                user=user,
                address=address,
                balance=balance,
                coin_type=4,
                message=message,
                signature=signature
            )
            create_balance_dispatch(user, 4, balance, obj)

            obj = BTCSnapshot.objects.create(
                user=user,
                address=address,
                balance=balance,
                coin_type=5,
                message=message,
                signature=signature
            )
            create_balance_dispatch(user, 5, balance, obj)
    except Exception as e:
        logger.error("发放ULOGOS和BITCOIN LOGO失败：{0}".format(e))
        raise e


# TODO 需要删除
# 资金过户表，发生交易后进行资金过户
class BalanceTransfer(models.Model):
    send_user = models.ForeignKey(User, related_name='balance_transfer_send_user', verbose_name='发送用户',
                                  on_delete=models.CASCADE)
    recv_user = models.ForeignKey(User, related_name='balance_transfer_recv_user', verbose_name='接收用户',
                                  on_delete=models.CASCADE)
    coin_type = models.PositiveSmallIntegerField('币种', null=False, blank=False, default=1,
                                                 choices=COIN_TYPE_CHOICES)
    create_time = models.DateTimeField('过户时间', null=False, blank=False, default=timezone.now)

    amount = models.DecimalField('过户金额', max_digits=30, decimal_places=8, null=False, blank=False)

    # 交易记录
    tx_type = models.ForeignKey(ContentType, null=True, on_delete=models.CASCADE)
    tx_id = models.PositiveIntegerField(null=True)

    update_time = models.DateTimeField('最近更新时间', auto_now=True)
    status = models.PositiveSmallIntegerField('过户状态', null=False, blank=False, default=0,
                                              choices=BALANCE_TRANSFER_STATUS_CHOICES)

    class Meta:
        verbose_name = '资金过户'
        verbose_name_plural = '资金过户'
        ordering = ["-create_time"]

    # 0-已过户 --> 1-已取消
    def cancel(self):
        if self.status != 0:
            raise BalanceTransferException('资金不是已过户状态：发送用户{}，接收用户，币种{}，金额{}'.format(
                self.send_user_id, self.recv_user_id, self.coin_type, self.amount))

        try:
            with transaction.atomic():
                send_balance = Balances.objects.get(user=self.send_user, coin_type=self.coin_type)
                recv_balance = Balances.objects.get(user=self.recv_user, coin_type=self.coin_type)
                extra = {'send_user': self.send_user.id, 'recv_user': self.recv_user.id,
                         'coin_type': self.coin_type, 'amount': self.amount}
                send_balance.modify_available(self.amount, self, extra)
                recv_balance.modify_available(-self.amount, self, extra)
                BalanceTransfer.objects.select_for_update().filter(pk=self.pk).update(status=1)
        except Exception as e:
            logger.error('取消资金过户失败：{0}'.format(e))
            raise e

    # 1-已取消 --> 0-已过户
    def transfer(self):
        if self.status != 1:
            raise BalanceTransferException('资金不是已取消状态：发送用户{}，接收用户，币种{}，金额{}'.format(
                self.send_user_id, self.recv_user_id, self.coin_type, self.amount))

        try:
            with transaction.atomic():
                send_balance = Balances.objects.get(user=self.send_user, coin_type=self.coin_type)
                recv_balance = Balances.objects.get(user=self.recv_user, coin_type=self.coin_type)
                extra = {'send_user': self.send_user.id, 'recv_user': self.recv_user.id,
                         'coin_type': self.coin_type, 'amount': self.amount}
                send_balance.modify_available(-self.amount, self, extra)
                recv_balance.modify_available(self.amount, self, extra)
                BalanceTransfer.objects.select_for_update().filter(pk=self.pk).update(status=0)
        except Exception as e:
            logger.error('资金过户失败：{0}'.format(e))
            raise e


# TODO 需要删除
# 创建资金过户记录
# 发送手续费send_fee，amount中不包含手续费
# 接收手续费recv_fee，amount中包含了手续费
# tx为None，表明为用户之间直接转账（发送资金从available中扣除），否则是交易引起的过户转账（过户资金从frozen中扣除）
def create_balance_transfer(send_user, recv_user, coin_type, amount, send_fee=0, recv_fee=0, tx=None):
    try:
        tx_type = None
        tx_id = None
        if tx is not None:
            tx_type = ContentType.objects.get_for_model(tx)
            tx_id = tx.pk

        with transaction.atomic():
            obj = BalanceTransfer.objects.create(
                send_user=send_user,
                recv_user=recv_user,
                coin_type=coin_type,
                amount=amount,
                tx_type=tx_type,
                tx_id=tx_id
            )

            send_balance, _ = Balances.objects.get_or_create(user=send_user, coin_type=coin_type)
            create_balance_log(send_user, coin_type, 3, obj)
            extra = {'send_user': send_user.id, 'recv_user': recv_user.id,
                     'coin_type': coin_type, 'amount': -(amount + send_fee)}
            if tx is not None:
                send_balance.modify_frozen(-(amount + send_fee), obj, extra)
            else:
                send_balance.modify_available(-(amount + send_fee), obj, extra)
            if send_fee > 0:  # 手续费记账
                create_balance_fee(send_user, coin_type, -send_fee, tx)

            recv_balance, _ = Balances.objects.get_or_create(user=recv_user, coin_type=coin_type)
            create_balance_log(recv_user, coin_type, 3, obj)
            extra = {'send_user': send_user.id, 'recv_user': recv_user.id,
                     'coin_type': coin_type, 'amount': (amount - recv_fee)}
            recv_balance.modify_available(amount - recv_fee, obj, extra)
            if recv_fee > 0:  # 手续费记账
                create_balance_fee(recv_user, coin_type, -recv_fee, tx)

        return obj
    except Exception as e:
        logger.error("创建资金过户记录失败：{0}".format(e))
        raise e


# TODO 需要删除
# 资金冻结表，提交订单时冻结资金（需要删除）
# 资金路径   frozen <----> available
class BalanceFrozen(models.Model):
    user = models.ForeignKey(User, related_name='balancefrozen', verbose_name='用户',
                             on_delete=models.CASCADE)
    coin_type = models.PositiveSmallIntegerField('币种', null=False, blank=False, default=1,
                                                 choices=COIN_TYPE_CHOICES)
    amount = models.DecimalField('金额', max_digits=30, decimal_places=8, null=False, blank=False)

    # 交易记录
    tx_type = models.ForeignKey(ContentType, null=True, on_delete=models.CASCADE)
    tx_id = models.PositiveIntegerField(null=True)

    create_time = models.DateTimeField('冻结时间', null=False, blank=False, default=timezone.now)
    update_time = models.DateTimeField('最近更新时间', auto_now=True)
    status = models.PositiveSmallIntegerField('冻结状态', null=False, blank=False, default=0,
                                              choices=BALANCE_FROZEN_STATUS_CHOICES)

    class Meta:
        verbose_name = '资金冻结'
        verbose_name_plural = '资金冻结'
        ordering = ["-create_time"]

    # 0-已冻结 --> 1-已解冻
    def unfrozen(self):
        if self.status != 0:
            raise BalanceFrozenException('资金不是已冻结状态：用户{}，币种{}，金额{}'.format(
                self.user_id, self.coin_type, self.amount))

        try:
            with transaction.atomic():
                balance = Balances.objects.get(user=self.user, coin_type=self.coin_type)
                extra = {'user': self.user_id, 'coin_type': self.coin_type,
                         'amount': self.amount}
                balance.frozen_to_available(self.amount, self, extra)
                BalanceFrozen.objects.select_for_update().filter(pk=self.pk).update(status=1)
        except Exception as e:
            logger.error('取消资金冻结失败：{0}'.format(e))
            raise e

    # 1-已解冻 --> 0-已冻结
    def frozen(self):
        if self.status != 1:
            raise BalanceFrozenException('资金不是已解冻状态：用户{}，币种{}，金额{}'.format(
                self.user_id, self.coin_type, self.amount))

        try:
            with transaction.atomic():
                balance = Balances.objects.get(user=self.user, coin_type=self.coin_type)
                extra = {'user': self.user_id, 'coin_type': self.coin_type,
                         'amount': self.amount}
                balance.available_to_frozen(self.amount, self, extra)
                BalanceFrozen.objects.select_for_update().filter(pk=self.pk).update(status=0)
        except Exception as e:
            logger.error('资金解冻失败：{0}'.format(e))
            raise e


# TODO 需要删除
# 创建资金冻结记录，用于提交订单时
def create_balance_frozen(user, coin_type, amount, tx=None):
    try:
        tx_type = None
        tx_id = None
        if tx is not None:
            tx_type = ContentType.objects.get_for_model(tx)
            tx_id = tx.pk

        with transaction.atomic():
            obj = BalanceFrozen.objects.create(
                user=user,
                coin_type=coin_type,
                amount=amount,
                tx_type=tx_type,
                tx_id=tx_id
            )
            balance, created = Balances.objects.get_or_create(user=user, coin_type=coin_type)
            extra = {'user': user.id, 'coin_type': coin_type, 'amount': amount}
            balance.available_to_frozen(amount, obj, extra)
            create_balance_log(user, coin_type, 5, obj)

        return obj
    except Exception as e:
        logger.error("创建资金冻结记录失败：{0}".format(e))
        raise e


# TODO 需要删除
# 资金解冻表，交易完成后或者撤消订单后剩余的资金退回（需要删除）
# 资金路径   frozen <----> available
class BalanceUnfrozen(models.Model):
    user = models.ForeignKey(User, related_name='balanceback', verbose_name='用户',
                             on_delete=models.CASCADE)
    coin_type = models.PositiveSmallIntegerField('币种', null=False, blank=False, default=1,
                                                 choices=COIN_TYPE_CHOICES)
    amount = models.DecimalField('金额', max_digits=30, decimal_places=8, null=False, blank=False)

    # 交易记录
    tx_type = models.ForeignKey(ContentType, null=True, on_delete=models.CASCADE)
    tx_id = models.PositiveIntegerField(null=True)

    create_time = models.DateTimeField('解冻时间', null=False, blank=False, default=timezone.now)
    update_time = models.DateTimeField('最近更新时间', auto_now=True)
    status = models.PositiveSmallIntegerField('解冻状态', null=False, blank=False, default=0,
                                              choices=BALANCE_UNFROZEN_STATUS_CHOICES)

    class Meta:
        verbose_name = '资金解冻'
        verbose_name_plural = '资金解冻'
        ordering = ["-create_time"]

    # 0-已解冻 --> 1-已冻结
    def frozen(self):
        if self.status != 0:
            raise BalanceUnfrozenException('资金不是已解冻状态：用户{}，币种{}，金额{}'.format(
                self.user_id, self.coin_type, self.amount))

        try:
            with transaction.atomic():
                balance = Balances.objects.get(user=self.user, coin_type=self.coin_type)
                extra = {'user': self.user_id, 'coin_type': self.coin_type,
                         'amount': self.amount}
                balance.available_to_frozen(self.amount, self, extra)
                BalanceUnfrozen.objects.select_for_update().filter(pk=self.pk).update(status=1)
        except Exception as e:
            logger.error('取消资金解冻失败：{0}'.format(e))
            raise e

    # 1-已冻结 --> 0-已解冻
    def unfrozen(self):
        if self.status != 1:
            raise BalanceUnfrozenException('资金不是已冻结状态：用户{}，币种{}，金额{}'.format(
                self.user_id, self.coin_type, self.amount))

        try:
            with transaction.atomic():
                balance = Balances.objects.get(user=self.user, coin_type=self.coin_type)
                extra = {'user': self.user_id, 'coin_type': self.coin_type,
                         'amount': self.amount}
                balance.frozen_to_available(self.amount, self, extra)
                BalanceUnfrozen.objects.select_for_update().filter(pk=self.pk).update(status=0)
        except Exception as e:
            logger.error('资金解冻失败：{0}'.format(e))
            raise e


# TODO 需要删除
# 创建资金解冻记录，交易完成后或者撤消订单后剩余的资金退回
def create_balance_unfrozen(user, coin_type, amount, tx=None):
    try:
        tx_type = None
        tx_id = None
        if tx is not None:
            tx_type = ContentType.objects.get_for_model(tx)
            tx_id = tx.pk

        with transaction.atomic():
            obj = BalanceUnfrozen.objects.create(
                user=user,
                coin_type=coin_type,
                amount=amount,
                tx_type=tx_type,
                tx_id=tx_id
            )
            balance, created = Balances.objects.get_or_create(user=user, coin_type=coin_type)
            extra = {'user': user.id, 'coin_type': coin_type, 'amount': amount}
            balance.frozen_to_available(amount, obj, extra)
            create_balance_log(user, coin_type, 6, obj)

        return obj
    except Exception as e:
        logger.error("创建资金解冻记录失败：{0}".format(e))
        raise e
