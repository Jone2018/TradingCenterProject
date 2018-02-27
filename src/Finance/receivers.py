# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import logging

from django.dispatch import receiver

from .models import DepositAddress
from .signals import deposit_address_create

logger = logging.getLogger(__name__)


# 添加新的BTC地址后，通知交易模块
@receiver(deposit_address_create, sender=DepositAddress)
def update_address_list(sender, **kwargs):
    address = kwargs["address"]
    logger.debug(address)
