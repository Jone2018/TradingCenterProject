# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from random import paretovariate

from django.contrib.auth.models import BaseUserManager
from django.db.models import Max

from .utils import reserve_uid


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, username, password, **extra_fields):
        """
        Creates and saves a User with the given username and password.
        """
        if not username:
            raise ValueError('用户名不能为空')

        # if not password:
        #     raise ValueError('密码不能为空')

        if self.filter(username=username).exists():
            raise KeyError('用户名已注册')

        max_uid = self.all().aggregate(Max('uid'))
        if max_uid['uid__max']:
            uid = max_uid['uid__max'] + int(paretovariate(1))
        else:
            uid = 10001

        while reserve_uid(uid):
            uid += int(paretovariate(1))

        username = str(uid)
        user = self.model(username=username, uid=uid, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(username, password, **extra_fields)

    def create_superuser(self, username, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(username, password, **extra_fields)
