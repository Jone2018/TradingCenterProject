# -*- coding: utf-8 -*-
from django.contrib import admin

# Register your models here.
from .models import Transaction, MarketInfo


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'pair_id',
        'direction',
        'user_id1',
        'user_id2',
        'order_id1',
        'order_id2',
        'price',
        'quantity',
        'fee1',
        'fee2',
        'reverse',
        'create_time',
        'status'
    )
    list_filter = ('direction', 'pair_id', 'status', 'create_time')
    search_fields = ('id', 'order_id1', 'order_id2', 'create_time')
    ordering = ['-status', 'create_time']
    readonly_fields = (
        'pair_id',
        'order_id1',
        'user_id1',
        'order_id2',
        'user_id2',
        'price',
        'quantity',
        'direction',
        'create_time',
        'fee1',
        'fee2',
        'reverse',
        'status'
    )

    def has_delete_permission(self, request, obj=None):
        return None

    def has_add_permission(self, request):
        return None

    def get_actions(self, request):
        return None

    class Media:
        js = (
            '/static/js/order.js',
        )

# class MarketInfo(models.Model):
#     """买卖方向、价格、数量、交易对、是否为新数据"""
#     pair_id = models.PositiveSmallIntegerField('交易对编码', null=False, blank=False,
#                                                default=1, choices=PAIR_CHOICES)
#     direction = models.PositiveSmallIntegerField('下单方向', null=False, blank=False, default=0,
#                                                  choices=ORDER_DIRECTION_CHOICES)
#     price = models.CharField('价格', max_length=10, null=False, blank=False)
#     quantity = models.DecimalField('数量', max_digits=30, decimal_places=8, null=False, blank=False,
#                                    validators=[MinValueValidator(0)])
#     is_new = models.PositiveSmallIntegerField('是否为新数据', null=False, blank=False, default=0, choices=IS_NEW_CHOICES)


@admin.register(MarketInfo)
class MarketInfoAdmin(admin.ModelAdmin):

    list_display = ('id', 'pair_id', 'direction', 'price', 'quantity', 'is_new')
    search_fields = ('id',)
    list_filter = ('pair_id', 'direction', 'is_new')
    ordering = ('-is_new',)
    readonly_fields = ('id', 'pair_id', 'direction', 'price', 'quantity', 'is_new')

    def has_delete_permission(self, request, obj=None):
        return None

    def has_add_permission(self, request):
        return None

    def get_actions(self, request):
        return None

    class Media:
        js = (
            '/static/js/order.js',
        )

