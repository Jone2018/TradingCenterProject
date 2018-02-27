# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from importlib import import_module

from django.apps import AppConfig


class AccountConfig(AppConfig):
    name = 'Account'
    verbose_name = '用户管理'

    def ready(self):
        import_module("Account.receivers")
