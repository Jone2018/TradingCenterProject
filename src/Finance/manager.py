# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

from .signals import deposit_address_create
from .utils import *


class DepositAddressManager(models.Manager):
    use_in_migrations = True

    def _create_btc_address(self, user, **extra_fields):
        if user.id > 0:
            address = get_btc_address(user.id)
            obj = self.model(user=user, address=address, **extra_fields)
            obj.save(using=self._db)
            return obj
        else:
            raise ValueError('user id must be positive integer')

    def _create_eth_address(self, user, **extra_fields):
        if user.id > 0:
            address = get_eth_address(user.id)
            obj = self.model(user=user, address=address, **extra_fields)
            obj.save()
            return obj
        else:
            raise ValueError('user id must be positive integer')

    def _create_sngls_address(self, user, **extra_fields):
        if user.id > 0:
            address = get_sngls_address(user.id)
            obj = self.model(user=user, address=address, **extra_fields)
            obj.save()
            return obj
        else:
            raise ValueError('user id must be positive integer')

    def _create_mkr_address(self, user, **extra_fields):
        if user.id > 0:
            address = get_mkr_address(user.id)
            obj = self.model(user=user, address=address, **extra_fields)
            obj.save()
            return obj
        else:
            raise ValueError('user id must be positive integer')

    def _create_bcap_address(self, user, **extra_fields):
        if user.id > 0:
            address = get_bcap_address(user.id)
            obj = self.model(user=user, address=address, **extra_fields)
            obj.save()
            return obj
        else:
            raise ValueError('user id must be positive integer')

    def _create_agrs_address(self, user, **extra_fields):
        if user.id > 0:
            address = get_agrs_address(user.id)
            obj = self.model(user=user, address=address, **extra_fields)
            obj.save()
            return obj
        else:
            raise ValueError('user id must be positive integer')

    def _create_wkc_address(self, user, **extra_fields):
        address = settings.WKC_ADDRESS
        obj = self.model(user=user, address=address, **extra_fields)
        obj.save(using=self._db)
        return obj

    def _create_xpm_address(self, user, **extra_fields):
        if user.id > 0:
            address = get_xpm_address(user.id)
            obj = self.model(user=user, address=address, **extra_fields)
            obj.save(using=self._db)
            return obj
        else:
            raise ValueError('user id must be positive integer')

    def _create_bcc_address(self, user, **extra_fields):
        if user.id > 0:
            address = get_bcc_address(user.id)
            obj = self.model(user=user, address=address, **extra_fields)
            obj.save(using=self._db)
            return obj
        else:
            raise ValueError('user id must be positive integer')

    def _create_etc_address(self, user, **extra_fields):
        if user.id > 0:
            address = get_etc_address(user.id)
            obj = self.model(user=user, address=address, **extra_fields)
            obj.save(using=self._db)
            return obj
        else:
            raise ValueError('user id must be positive integer')

    def _create_tel_address(self, user, **extra_fields):
        if user.id > 0:
            address = get_tel_address(user.id)
            obj = self.model(user=user, address=address, **extra_fields)
            obj.save(using=self._db)
            return obj
        else:
            raise ValueError('user id must be positive integer')

    def create_address(self, user, coin_type, **extra_fields):
        if coin_type == 1:  # BTC
            extra_fields.setdefault('coin_type', 1)
            address = self._create_btc_address(user, **extra_fields)
            deposit_address_create.send(sender=address.__class__, address=address.address)
            return address
        elif coin_type == 2:  # ETH
            extra_fields.setdefault('coin_type', 2)
            address = self._create_eth_address(user, **extra_fields)
            deposit_address_create.send(sender=address.__class__, address=address.address)
            return address
        elif coin_type == 3:  # ETC
            extra_fields.setdefault('coin_type', 3)
            address = self._create_etc_address(user, **extra_fields)
            deposit_address_create.send(sender=address.__class__, address=address.address)
            return address
        elif coin_type == 6:  # WKC
            extra_fields.setdefault('coin_type', 6)
            address = self._create_wkc_address(user, **extra_fields)
            deposit_address_create.send(sender=address.__class__, address=address.address)
            return address
        elif coin_type == 7:  # SNGLS
            extra_fields.setdefault('coin_type', 7)
            address = self._create_sngls_address(user, **extra_fields)
            deposit_address_create.send(sender=address.__class__, address=address.address)
            return address
        elif coin_type == 8:  # MKR
            extra_fields.setdefault('coin_type', 8)
            address = self._create_mkr_address(user, **extra_fields)
            deposit_address_create.send(sender=address.__class__, address=address.address)
            return address
        elif coin_type == 9:  # BCAP
            extra_fields.setdefault('coin_type', 9)
            address = self._create_bcap_address(user, **extra_fields)
            deposit_address_create.send(sender=address.__class__, address=address.address)
            return address
        elif coin_type == 10:  # AGRS
            extra_fields.setdefault('coin_type', 10)
            address = self._create_agrs_address(user, **extra_fields)
            deposit_address_create.send(sender=address.__class__, address=address.address)
            return address
        elif coin_type == 11:  # XPM
            extra_fields.setdefault('coin_type', 11)
            address = self._create_xpm_address(user, **extra_fields)
            deposit_address_create.send(sender=address.__class__, address=address.address)
            return address
        elif coin_type == 14:  # XPM
            extra_fields.setdefault('coin_type', 14)
            address = self._create_bcc_address(user, **extra_fields)
            deposit_address_create.send(sender=address.__class__, address=address.address)
            return address
        elif coin_type == 15:  # TEL
            extra_fields.setdefault('coin_type', 15)
            address = self._create_tel_address(user, **extra_fields)
            deposit_address_create.send(sender=address.__class__, address=address.address)
            return address
        else:
            raise ValueError('non-support coin type')


class DepositBTCAddressManager(models.Manager):
    def get_queryset(self):
        return super(DepositBTCAddressManager, self).get_queryset().filter(coin_type=1)


class BalanceManager(models.Manager):
    def get_address(self, address, coin_type):
        return self.get(user__deposit_address__address=address, coin_type=coin_type)


class BalanceBTCManager(models.Manager):
    def get_queryset(self):
        return super(BalanceBTCManager, self).get_queryset().filter(coin_type=1)

    def get_address(self, address):
        return self.get(user__deposit_address__address=address)
