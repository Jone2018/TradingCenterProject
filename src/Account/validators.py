# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import re

from django.core.exceptions import ValidationError
from phonenumber_field.phonenumber import to_python


# 弃用
# def UsernameValidator(value):
#     regex = re.compile(r'^[a-zA-Z0-9][0-9a-zA-Z_]{3,17}$')
#     if not regex.match(value):
#         raise ValidationError('用户名必须以字母或数字开头，长度在4-18之间，且只能包含字母、数字和下划线', code='invalid_username')


def PhoneNumberValidator(value):
    phone_number = to_python(value)
    if phone_number.country_code == 86:
        regex = re.compile(r'^[a-zA-Z0-9][0-9a-zA-Z_]{3,17}$')
        if not regex.match(str(phone_number.national_number)):
            raise ValidationError('手机号码格式不正确', code='invalid_phone_number')
