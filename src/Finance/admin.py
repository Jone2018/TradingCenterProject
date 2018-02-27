# -*- coding: utf-8 -*-
from django.contrib import admin
from django.contrib.admin import SimpleListFilter

from Account.models import User
from Dic.models import CoinType
from .models import (
    Balances,
    BalanceHistory,
    BalanceLog,
    DepositAddress,
    WithdrawAddress,
    BalanceTransfer,
    BalanceFee,
    BalanceDispatch,
    BalanceCharge
)


class CoinTypeListFilter(SimpleListFilter):
    title = '币种'
    parameter_name = 'coin_type'

    def lookups(self, request, model_admin):
        cts = CoinType.objects.all()
        dict_cts = {}
        for ct in cts:
            dict_cts[ct.id] = ct.code
        return ((k, v) for (k, v) in dict_cts.items())

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(coin_type=self.value())


class AvailableRangeFilter(SimpleListFilter):
    title = '可用余额'
    parameter_name = 'available'

    def lookups(self, request, model_admin):
        return (
            ('0', '0~10'),
            ('1', '10~100'),
            ('2', '100~'),
        )

    def queryset(self, request, queryset):
        if self.value() == '0':
            return queryset.filter(available__range=(0, 10))
        elif self.value() == '1':
            return queryset.filter(available__range=(10, 100))
        elif self.value() == '2':
            return queryset.filter(available__gt=100)


@admin.register(Balances)
class BalancesAdmin(admin.ModelAdmin):

    def coin_type_code(self, obj):
        cointype = CoinType.objects.get(pk=obj.coin_type)
        return cointype.code

    coin_type_code.short_description = '币种'
    list_filter = (CoinTypeListFilter, AvailableRangeFilter)
    list_display = ('id', 'user', 'coin_type_code', 'available', 'frozen', 'unconfirmed')
    search_fields = ('user__username',)
    readonly_fields = ('id',)

    def get_list_display_links(self, request, list_display):
        return None

    def get_actions(self, request):
        return None

    def has_delete_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request):
        return False


@admin.register(DepositAddress)
class DepositAddressAdmin(admin.ModelAdmin):

    def coin_type_code(self, obj):
        cointype = CoinType.objects.get(pk=obj.coin_type)
        return cointype.code

    coin_type_code.short_description = '币种'
    list_display = ('id', 'user', 'coin_type_code', 'address', 'create_time', 'is_active')
    search_fields = ('user__username', 'address')
    ordering = ('-create_time',)
    readonly_fields = ('id',)

    def get_list_display_links(self, request, list_display):
        return None

    def get_actions(self, request):
        return None

    def has_delete_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request):
        return False


@admin.register(WithdrawAddress)
class WithdrawAddressAdmin(admin.ModelAdmin):

    def coin_type_code(self, obj):
        cointype = CoinType.objects.get(pk=obj.coin_type)
        return cointype.code

    coin_type_code.short_description = '币种'
    list_display = (
        'id',
        'user',
        'coin_type_code',
        'address',
        'label',
        'create_time',
        'update_time',
        'is_active',
        'is_verified')
    search_fields = ('user__username', 'address')
    ordering = ('-update_time',)
    readonly_fields = ('id',)

    def get_list_display_links(self, request, list_display):
        return None

    def get_actions(self, request):
        return None

    def has_delete_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request):
        return False


@admin.register(BalanceTransfer)
class BalanceTransferAdmin(admin.ModelAdmin):

    def coin_type_code(self, obj):
        cointype = CoinType.objects.get(pk=obj.coin_type)
        return cointype.code

    coin_type_code.short_description = '币种'
    list_display = ('id', 'send_user', 'recv_user', 'coin_type_code', 'amount', 'create_time', 'status')
    list_filter = (CoinTypeListFilter, 'status')
    search_fields = ('send_user__username', 'recv_user__username')
    ordering = ('-update_time',)
    readonly_fields = ('id', 'create_time',)

    def get_list_display_links(self, request, list_display):
        return None

    def get_actions(self, request):
        return None

    def has_delete_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request):
        return False


@admin.register(BalanceHistory)
class BalanceHistoryAdmin(admin.ModelAdmin):
    def user_uid(self, obj):
        user = User.objects.get(pk=obj.balance.user.id)
        return user.uid

    user_uid.short_description = '用户UID'
    list_display = (
        'id', 'user_uid', 'balance', 'timestamp',
        'action', 'amount', 'fee', 'content_type',
        'available', 'frozen', 'unconfirmed', 'category',
        'reason'
    )
    ordering = ('-timestamp',)
    list_filter = ('action', 'timestamp')
    search_fields = ('balance__user__uid', 'extra')
    readonly_fields = ('id',)

    def get_list_display_links(self, request, list_display):
        return None

    def get_actions(self, request):
        return None

    def has_delete_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request):
        return False


@admin.register(BalanceLog)
class BalanceLogAdmin(admin.ModelAdmin):
    def user_uid(self, obj):
        user = User.objects.get(pk=obj.user.id)
        return user.uid

    user_uid.short_description = '用户UID'

    def coin_type_code(self, obj):
        cointype = CoinType.objects.get(pk=obj.coin_type)
        return cointype.code

    coin_type_code.short_description = '币种'
    list_display = ('id', 'user_uid', 'coin_type_code', 'finance_type', 'order_type', 'order_id', 'timestamp')
    list_filter = (CoinTypeListFilter, 'finance_type')
    ordering = ('coin_type', '-timestamp')
    search_fields = ('user__uid', 'order_id')
    readonly_fields = ('id', 'timestamp')

    def get_list_display_links(self, request, list_display):
        return None

    def get_actions(self, request):
        return None

    def has_delete_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request):
        return False


@admin.register(BalanceFee)
class BalanceFeeAdmin(admin.ModelAdmin):
    def user_uid(self, obj):
        user = User.objects.get(pk=obj.user.id)
        return user.uid

    user_uid.short_description = '用户UID'

    def coin_type_code(self, obj):
        cointype = CoinType.objects.get(pk=obj.coin_type)
        return cointype.code

    coin_type_code.short_description = '币种'
    list_display = (
        'id',
        'user_uid',
        'coin_type_code',
        'tx_type',
        'tx_id',
        'create_time',
        'update_time',
        'status'
    )
    list_filter = (CoinTypeListFilter, 'status')
    ordering = ('coin_type', '-create_time')
    search_fields = ('user__uid',)
    readonly_fields = ('id', 'create_time', 'update_time',)

    def get_list_display_links(self, request, list_display):
        return None

    def get_actions(self, request):
        return None

    def has_delete_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request):
        return False


@admin.register(BalanceDispatch)
class BalanceDispatchAdmin(admin.ModelAdmin):
    def user_uid(self, obj):
        user = User.objects.get(pk=obj.user.id)
        return user.uid

    user_uid.short_description = '用户UID'

    def coin_type_code(self, obj):
        cointype = CoinType.objects.get(pk=obj.coin_type)
        return cointype.code

    coin_type_code.short_description = '币种'
    list_display = (
        'id',
        'user_uid',
        'coin_type_code',
        'amount',
        'tx_type',
        'tx_id',
        'create_time',
        'update_time',
        'status'
    )
    list_filter = (CoinTypeListFilter, 'status')
    ordering = ('coin_type', '-create_time')
    search_fields = ('user__uid',)
    readonly_fields = ('id', 'create_time', 'update_time',)

    def get_list_display_links(self, request, list_display):
        return None

    def get_actions(self, request):
        return None

    def has_delete_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request):
        return False


@admin.register(BalanceCharge)
class BalanceChargeAdmin(admin.ModelAdmin):
    def user_uid(self, obj):
        user = User.objects.get(pk=obj.address.user.id)
        return user.uid

    user_uid.short_description = '用户UID'

    def coin_type_code(self, obj):
        cointype = CoinType.objects.get(pk=obj.address.coin_type)
        return cointype.code

    coin_type_code.short_description = '币种'
    list_display = (
        'id',
        'user_uid',
        'coin_type_code',
        'address',
        'amount',
        'tx_type',
        'tx_id',
        'create_time',
        'update_time',
        'status'
    )
    list_filter = ('status',)
    ordering = ('-create_time',)
    search_fields = ('address__user__uid',)
    readonly_fields = ('id', 'create_time', 'update_time',)

    def get_list_display_links(self, request, list_display):
        return None

    def get_actions(self, request):
        return None

    def has_delete_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request):
        return False
