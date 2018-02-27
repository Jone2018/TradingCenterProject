# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import sys
from decimal import Decimal, ROUND_UP
from Dic.conf import *
from Dic.models import CoinType, PairChoices, FeeType, ActionChoices
from Finance.models import Balances
from django.core.validators import MinValueValidator
from django.db import models, transaction
from django.utils import timezone

from .utils import unique_code, calc_fee

reload(sys)
sys.setdefaultencoding('utf-8')


# 选择项
COIN_TYPE_CHOICES = ((ct.id, ct.code) for ct in CoinType.objects.all())
PAIR_CHOICES = ((pc.id, pc.name) for pc in PairChoices.objects.all())
FEE_TYPE_CHOICES = ((ft.id, ft.name) for ft in FeeType.objects.all())
ORDER_ACTION_CHOICES = ((ac.id, ac.name) for ac in ActionChoices.objects.all())
ORDER_STATUS_CHOICES = ((k, v) for (k, v) in DIC_TRADE_ORDER_STATUS.items())
ORDER_DIRECTION_CHOICES = ((k, v) for (k, v) in DIC_TRADE_ORDER_DIRECTION.items())
ORDER_TYPE_CHOICES = ((k, v) for (k, v) in DIC_TRADE_ORDER_TYPE.items())
CANCELORDER_STATUS_CHOICES = ((k, v) for (k, v) in DIC_TRADE_CANCELORDER_STATUS.items())

DECIMAL_UP = lambda x: x.quantize(Decimal('0.00000001'), ROUND_UP)

# 交易订单
class Order(models.Model):
    user_id = models.IntegerField('用户ID', null=False, blank=False)
    pair_id = models.PositiveSmallIntegerField('交易对编码', null=False, blank=False,
                                               default=1, choices=PAIR_CHOICES)
    order_code = models.CharField('订单编码', max_length=20, null=False, blank=False,
                                  unique=True, default=unique_code)

    # 价格采用科学计数法表示，保留4位有效数字，形式为 x.xxxE±xx，需要用正则表达式进行专门的参数检查
    price = models.CharField('价格', max_length=10, null=False, blank=False)
    quantity = models.DecimalField('数量', max_digits=30, decimal_places=8, null=False, blank=False,
                                   validators=[MinValueValidator(0)])
    direction = models.PositiveSmallIntegerField('下单方向', null=False, blank=False, default=0,
                                                 choices=ORDER_DIRECTION_CHOICES)
    action = models.PositiveSmallIntegerField('下单方式', null=False, blank=False, default=0,
                                              choices=ORDER_ACTION_CHOICES)
    auto_cancel = models.BooleanField('是否允许系统自动撤消', null=False, blank=False, default=True)

    create_time = models.DateTimeField('下单时间', null=False, blank=False, default=timezone.now)
    valid_time = models.DateTimeField('有效期', null=True)
    update_time = models.DateTimeField('最近更新时间', auto_now=True)

    fee_type = models.PositiveSmallIntegerField('费率方式', null=False, blank=False, default=0,
                                                choices=FEE_TYPE_CHOICES)
    fee = models.DecimalField('手续费', max_digits=30, decimal_places=8, null=False, blank=False, default=0)
    status = models.PositiveSmallIntegerField('状态', default=0, choices=ORDER_STATUS_CHOICES)

    dealed = models.DecimalField('成交数量', max_digits=30, decimal_places=8, null=False, blank=False, default=0)
    canceled = models.DecimalField('撤消数量', max_digits=30, decimal_places=8, null=False, blank=False, default=0)
    order_type = models.PositiveSmallIntegerField('订单类型', null=False, blank=False, default=0,
                                                  choices=ORDER_TYPE_CHOICES)

    # 仅适用于买单：已冻结金额和已成交金额都包括手续费，如果订单撤消或者全部成交，则退回frozen-transfer金额
    # 对于卖单，则frozen=quantity，transfer=dealed
    frozen = models.DecimalField('已冻结金额', max_digits=30, decimal_places=8, null=False, blank=False, default=0)
    transfer = models.DecimalField('已成交金额', max_digits=30, decimal_places=8, null=False, blank=False, default=0)

    class Meta:
        ordering = ('create_time',)
        verbose_name = '订单'
        verbose_name_plural = '订单'

    def __unicode__(self):
        return self.order_code

    def __str__(self):
        return "{}，时间：{}，价格：{}，数量：{}".format(self.get_direction_display(),
                                             self.create_time, self.price, self.quantity)

    # 撤销订单
    def cancel(self):
        if self.status != 0 and self.status != 1:
            raise Exception('订单无法撤销')

        with transaction.atomic():
            with transaction.atomic(using='order_db'):
                remain = self.frozen - self.transfer
                pair = PairChoices.objects.get(id=self.pair_id)
                coin_type = pair.coin_type_a if self.direction == 0 else pair.coin_type_b

                # 解冻资金
                amount = remain
                fee = 0
                if self.status == 0:
                    category = 41
                    reason = "交易订单撤销"
                else:
                    category = 42
                    reason = "交易订单返还"
                extra = {'user_id': self.user_id, 'coin_type': coin_type}
                balance = Balances.objects.get(user_id=self.user_id, coin_type=coin_type)
                balance.frozen_to_available(amount=amount, fee=fee, category=category, reason=reason,
                                            obj=self, extra=extra)

                # 更新订单参数
                canceled = self.quantity - self.dealed
                if self.status == 0:
                    Order.objects.select_for_update().filter(pk=self.pk).update(canceled=canceled, status=5,
                                                                                update_time=timezone.now())
                else:
                    Order.objects.select_for_update().filter(pk=self.pk).update(canceled=canceled, status=4,
                                                                                update_time=timezone.now())


# 创建订单
def create_order(user_id, pair_id, price, quantity, direction, fee_type=0, action=0, auto_cancel=True, valid_time=None):
    with transaction.atomic():
        with transaction.atomic(using='order_db'):
            data = {'user_id': user_id, 'pair_id': pair_id, 'price': price, 'quantity': Decimal(quantity),
                    'direction': direction, 'fee_type': fee_type, 'action': action,
                    'auto_cancel': auto_cancel, 'valid_time': valid_time}

            if direction == 0:
                data['fee'] = calc_fee(fee_type, price, quantity)
                data['frozen'] = DECIMAL_UP(Decimal(price) * Decimal(quantity)) + data['fee']
            else:
                data['fee'] = 0
                data['frozen'] = Decimal(quantity)

            pair = PairChoices.objects.get(id=pair_id)
            coin_type = pair.coin_type_a if direction == 0 else pair.coin_type_b

            # 创建订单并冻结资金
            order = Order.objects.create(**data)
            amount = data['frozen']
            fee = data['fee']
            category = 40
            reason = "交易订单提交"
            extra = {'user_id': user_id, 'coin_type': coin_type}
            (balance, is_created) = Balances.objects.get_or_create(user_id=user_id, coin_type=coin_type)
            balance.available_to_frozen(amount=amount, fee=fee, category=category, reason=reason,
                                        obj=order, extra=extra)

            return order

# 交易撤单
class CancelOrder(models.Model):
    order = models.ForeignKey(Order, related_name='cancelorder', verbose_name='订单', on_delete=models.CASCADE)
    create_time = models.DateTimeField('提交时间', null=False, blank=False, default=timezone.now)
    cancel_time = models.DateTimeField('撤单时间', null=True, blank=True)
    update_time = models.DateTimeField('最近更新时间', auto_now=True)

    order_type = models.PositiveSmallIntegerField('订单类型', null=False, blank=False, default=1,
                                                  choices=ORDER_TYPE_CHOICES)
    status = models.PositiveSmallIntegerField('状态', null=False, blank=False, default=0,
                                              choices=CANCELORDER_STATUS_CHOICES)

    class Meta:
        ordering = ('create_time', 'order_id',)
        verbose_name = '撤消订单'
        verbose_name_plural = '撤消订单'

    def __str__(self):
        return "撤单：{}，时间：{}，价格：{}，数量：{}".format(self.order.id, self.create_time,
                                                self.order.price, self.order.quantity)

    def cancel(self):
        CancelOrder.objects.select_for_update().filter(pk=self.pk).update(status=2, update_time=timezone.now())


# 提交撤销订单
def create_cancelorder(order_id):
    cancel_order = CancelOrder.objects.create(order_id=order_id)
    return cancel_order