# -*- coding: utf-8 -*-
from django.contrib import admin

# Register your models here.
from .models import Order, CancelOrder


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user_id',
        'pair_id',
        'direction',
        'price',
        'quantity',
        'fee',
        'create_time',
        'status'
    )
    list_filter = ('create_time', 'direction', 'status')
    search_fields = ('id', 'create_time')
    ordering = ('status', '-create_time')
    readonly_fields = (
        'id',
        'user_id',
        'pair_id',
        'order_code',
        'price',
        'quantity',
        'dealed',
        'canceled',
        'fee_type',
        'valid_time',
        'action',
        'direction',
        'create_time',
        'fee',
        'order_type',
        'status',
        'auto_cancel'
    )

    def has_add_permission(self, request):
        return None

    def has_delete_permission(self, request, obj=None):
        return None

    def get_actions(self, request):
        return None

    class Media:
        js = (
            '/static/js/order.js',
        )


@admin.register(CancelOrder)
class CancelOrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'create_time', 'order_type', 'status')
    list_filter = ('create_time', 'status')
    search_fields = ('id', 'order')
    ordering = ['status', '-create_time']
    readonly_fields = ['id', 'order', 'create_time', 'cancel_time', 'update_time', 'order_type', 'status']

    def has_add_permission(self, request):
        return None

    def has_delete_permission(self, request, obj=None):
        return None

    def get_actions(self, request):
        return None

    class Media:
        js = (
            '/static/js/order.js',
        )
