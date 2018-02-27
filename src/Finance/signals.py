# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import django.dispatch

deposit_address_create = django.dispatch.Signal(providing_args=["address"])
balance_history_logged = django.dispatch.Signal(providing_args=["event"])
