# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models


# Create your models here.

class CoinType(models.Model):
    code = models.CharField('编码', max_length=16, null=False, blank=False)
    name = models.CharField('名称', max_length=64, null=False)
    no = models.CharField('代码', max_length=16, null=False, blank=False)
    is_allow_display = models.BooleanField('是否在余额中显示', default=True)
    is_allow_charge = models.BooleanField('是否允许充值', default=True)
    is_allow_withdraw = models.BooleanField('是否允许提币', default=True)
    is_allow_transfer = models.BooleanField('是否允许转账', default=True)

    class Meta:
        verbose_name = '交易币种'
        verbose_name_plural = '交易币种'

    def __unicode__(self):
        return self.code


class PairChoices(models.Model):
    code = models.PositiveSmallIntegerField('编码', null=False, blank=False, default=0)
    name = models.CharField('名称', max_length=64, null=False, blank=False)
    coin_type_a = models.PositiveSmallIntegerField('交易币种-a', null=False, blank=False, default=0)
    coin_type_b = models.PositiveSmallIntegerField('交易币种-b', null=False, blank=False, default=0)
    is_allow_trade = models.BooleanField('是否允许交易', default=True)

    class Meta:
        verbose_name = '交易对'
        verbose_name_plural = '交易对'

    def __unicode__(self):
        return self.name


class ActionChoices(models.Model):
    code = models.PositiveSmallIntegerField('编码', null=False, blank=False, default=0)
    name = models.CharField('名称', max_length=64, null=False, blank=False)

    class Meta:
        verbose_name = '下单类型'
        verbose_name_plural = '下单类型'

    def __unicode__(self):
        return self.name


class FeeType(models.Model):
    code = models.PositiveSmallIntegerField('编码', null=False, blank=False, default=0)
    name = models.CharField('名称', max_length=64, null=False, blank=False)

    class Meta:
        verbose_name = '手续费类型'
        verbose_name_plural = '手续费类型'

    def __unicode__(self):
        return self.name
