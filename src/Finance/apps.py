# -*- coding: utf-8 -*-
from importlib import import_module

from django.apps import AppConfig


class FinanceConfig(AppConfig):
    name = 'Finance'
    verbose_name = '资产管理'

    def ready(self):
        import_module("Finance.receivers")
