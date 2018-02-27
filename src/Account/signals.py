# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import django.dispatch

user_action_logged = django.dispatch.Signal(providing_args=["event"])
