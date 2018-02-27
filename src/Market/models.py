# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import sys
import logging

from Dic.conf import *
from Dic.models import PairChoices
from django.core.validators import MinValueValidator
from django.db import models
from django.utils import timezone

reload(sys)
sys.setdefaultencoding('utf-8')

logger = logging.getLogger(__name__)

# 选择项
PAIR_CHOICES = ((pc.id, pc.name) for pc in PairChoices.objects.all())
TRANSACTION_STATUS_CHOICES = ((k, v) for (k, v) in DIC_TRADE_TRANSACTION_STATUS.items())
TRANSACTION_DIRECTION_CHOICES = ((k, v) for (k, v) in DIC_TRADE_TRANSACTION_DIRECTION.items())
ORDER_DIRECTION_CHOICES = ((k, v) for (k, v) in DIC_TRADE_ORDER_DIRECTION.items())
IS_NEW_CHOICES = (
    (0, '历史数据'),
    (1, '新数据')
)


# 已达成的交易
class Transaction(models.Model):
    pair_id = models.PositiveSmallIntegerField('交易对编码', null=False, blank=False,
                                               default=1, choices=PAIR_CHOICES)
    user_id1 = models.IntegerField('用户ID1', null=False, blank=False)
    order_id1 = models.IntegerField('订单ID1，买单', null=False, blank=False)
    user_id2 = models.IntegerField('用户ID2', null=False, blank=False)
    order_id2 = models.IntegerField('订单ID2，卖单', null=False, blank=False)

    direction = models.PositiveSmallIntegerField('交易类型', null=False, blank=False, default=0,
                                                 choices=TRANSACTION_DIRECTION_CHOICES)

    # 价格采用科学计数法表示，保留4位有效数字，形式为 x.xxxE±xx，需要用正则表达式进行专门的参数检查
    price = models.CharField('价格', max_length=10, null=False, blank=False)
    quantity = models.DecimalField('数量', max_digits=30, decimal_places=8, null=False, blank=False,
                                   validators=[MinValueValidator(0)])
    # 成交金额不包括手续费，买方付出amount+fee1，卖方获得amount-fee2
    amount = models.DecimalField('成交金额', max_digits=30, decimal_places=8, null=False, blank=False, default=0)
    fee1 = models.DecimalField('手续费1', max_digits=30, decimal_places=8, null=False, blank=False, default=0)
    fee2 = models.DecimalField('手续费2', max_digits=30, decimal_places=8, null=False, blank=False, default=0)
    reverse = models.BooleanField('是否撤消', null=False, default=False)

    create_time = models.DateTimeField('成交时间', blank=False, default=timezone.now)
    update_time = models.DateTimeField('最近更新时间', auto_now=True)
    status = models.PositiveSmallIntegerField('状态', null=False, blank=False, default=0,
                                              choices=TRANSACTION_STATUS_CHOICES)

    class Meta:
        ordering = ('create_time',)
        verbose_name = '交易'
        verbose_name_plural = '交易'

    def __str__(self):
        return "成交，时间：{}, 价格：{}，数量：{}".format(self.create_time, self.price, self.quantity)


class MarketInfo(models.Model):
    """买卖方向、价格、数量、交易对、是否为新数据"""
    pair_id = models.PositiveSmallIntegerField('交易对编码', null=False, blank=False,
                                               default=1, choices=PAIR_CHOICES)
    direction = models.PositiveSmallIntegerField('下单方向', null=False, blank=False, default=0,
                                                 choices=ORDER_DIRECTION_CHOICES)
    price = models.CharField('价格', max_length=10, null=False, blank=False)
    quantity = models.DecimalField('数量', max_digits=30, decimal_places=8, null=False, blank=False,
                                   validators=[MinValueValidator(0)])
    is_new = models.PositiveSmallIntegerField('是否为新数据', null=False, blank=False, default=0, choices=IS_NEW_CHOICES)

    @classmethod
    def update_new_info(cls, list_info, pair_id=1):
        try:
            assert isinstance(list_info, list), 'Param [list_info] should be a list of Queryset..'
            MarketInfo.objects.filter(pair_id=pair_id).delete()
            if list_info:
                MarketInfo.objects.bulk_create(list_info)
            return True, 'Update succeed..'
        except Exception as e:
            logger.error(e)
            return False, 'Update Failed.. [{}]'.format(e)

    class Meta:
        ordering = ('pair_id',)
        verbose_name = '买卖盘深度'
        verbose_name_plural = '买卖盘深度'

    def __str__(self):
        return "[{}] 交易对：{}，价格：{}，数量：{}".format('卖单' if self.direction else '买单', self.pair_id,
                                                self.price, self.quantity)
