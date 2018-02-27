# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from .models import CoinType, PairChoices, ActionChoices, FeeType

# Register your models here.


@admin.register(CoinType)
class CoinTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'code', 'name', 'no')
    readonly_fields = ('id', )

    def has_delete_permission(self, request, obj=None):
        return None

    def get_actions(self, request):
        return None


@admin.register(PairChoices)
class PairChoicesAdmin(admin.ModelAdmin):
    list_display = ('id', 'code', 'name', 'coin_type_a', 'coin_type_b')
    readonly_fields = ('id', )

    def has_delete_permission(self, request, obj=None):
        return None

    def get_actions(self, request):
        return None


@admin.register(ActionChoices)
class ActionChoicesAdmin(admin.ModelAdmin):
    list_display = ('id', 'code', 'name')
    readonly_fields = ('id', )

    def has_add_permission(self, request):
        return None

    def has_delete_permission(self, request, obj=None):
        return None

    def get_actions(self, request):
        return None


@admin.register(FeeType)
class FeeTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'code', 'name')
    readonly_fields = ('id', )

    def has_add_permission(self, request):
        return None

    def has_delete_permission(self, request, obj=None):
        return None

    def get_actions(self, request):
        return None

