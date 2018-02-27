# -*- coding: utf-8 -*-
import hashlib
import random
import re
import uuid

from django.conf import settings
from django.contrib.auth.password_validation import (MinimumLengthValidator)
from django.core.exceptions import ValidationError
from django.http.response import JsonResponse


def generate_random_token(extra=None, hash_func=hashlib.sha256):
    if extra is None:
        extra = []
    bits = extra + [str(random.SystemRandom().getrandbits(512))]
    return hash_func("".join(bits).encode("utf-8")).hexdigest()


def generate_random_code():
    return '%04d' % random.randint(0, 9999)


# 手机号码加*进行隐藏
def format_phone_number(phone_number):
    pass


# 获取用户信息
def get_user_info(user):
    try:
        # print user.profile.avatar
        avatar_url = get_avatar_url(user.profile.avatar)
    except Exception as e:
        # print e
        avatar_url = None

    if user.phone_number:
        phone_number = user.phone_number.as_e164
    else:
        phone_number = ""

    if user.email:
        email = user.email
    else:
        email = ""

    data = {
        "uid": user.uid,
        "username": user.username,
        "phone_number": phone_number,
        "email": email,
        "nickname": user.profile.nickname,
        "avatar_url": avatar_url,
        "is_set_password": user.is_set_password,
        "is_phone_verified": user.is_phone_verified,
        "is_email_verified": user.is_email_verified,
        "is_realname_verified": user.is_realname_verified,
        "date_joined": user.date_joined,
        "last_login_time": user.last_login,
        "last_login_ip": user.last_login_ip
    }

    return data


# 保留同数字的uid号码，输入的uid为字符串
def reserve_uid(uid):
    s = set(str(uid))
    return True if len(s) == 1 else False


# Errors=['验证通过!','身份证号码位数不对!','身份证号码出生日期超出范围或含有非法字符!','身份证号码校验错误!','身份证地区非法!']
def checkIdcard(idcard):
    Errors = ['验证通过!', '身份证号码位数不对!', '身份证号码出生日期超出范围或含有非法字符!', '身份证号码校验错误!', '身份证地区非法!']
    area = {"11": "北京", "12": "天津", "13": "河北", "14": "山西", "15": "内蒙古", "21": "辽宁", "22": "吉林", "23": "黑龙江",
            "31": "上海", "32": "江苏", "33": "浙江", "34": "安徽", "35": "福建", "36": "江西", "37": "山东", "41": "河南", "42": "湖北",
            "43": "湖南", "44": "广东", "45": "广西", "46": "海南", "50": "重庆", "51": "四川", "52": "贵州", "53": "云南", "54": "西藏",
            "61": "陕西", "62": "甘肃", "63": "青海", "64": "宁夏", "65": "新疆", "71": "台湾", "81": "香港", "82": "澳门", "91": "国外"}
    idcard = str(idcard)
    idcard = idcard.strip()
    idcard_list = list(idcard)

    # 地区校验
    if (not area[(idcard)[0:2]]):
        return JsonResponse({'result': False, 'code': 10065, 'msg': Errors[4]})
    # 15位身份号码检测
    if (len(idcard) == 15):
        if ((int(idcard[6:8]) + 1900) % 4 == 0 or (
                (int(idcard[6:8]) + 1900) % 100 == 0 and (int(idcard[6:8]) + 1900) % 4 == 0)):
            erg = re.compile(
                '[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$')  # //测试出生日期的合法性
        else:
            ereg = re.compile(
                '[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$')  # //测试出生日期的合法性
        if not re.match(ereg, idcard):
            return JsonResponse({'result': False, 'code': 10064, 'msg': Errors[2]})
    # 18位身份号码检测
    elif len(idcard) == 18:
        # 出生日期的合法性检查
        # 闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
        # 平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
        if int(idcard[6:10]) % 4 == 0 or (int(idcard[6:10]) % 100 == 0 and int(idcard[6:10]) % 4 == 0):
            ereg = re.compile(
                '[1-9][0-9]{5}(19[0-9]{2}|20[0-9]{2})((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$')  # //闰年出生日期的合法性正则表达式
        else:
            ereg = re.compile(
                '[1-9][0-9]{5}(19[0-9]{2}|20[0-9]{2})((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$')  # //平年出生日期的合法性正则表达式
        # //测试出生日期的合法性
        if re.match(ereg, idcard):
            # //计算校验位
            S = (int(idcard_list[0]) +
                 int(idcard_list[10])) * 7 + \
                (int(idcard_list[1]) +
                 int(idcard_list[11])) * 9 + \
                (int(idcard_list[2]) +
                 int(idcard_list[12])) * 10 + \
                (int(idcard_list[3]) +
                 int(idcard_list[13])) * 5 + \
                (int(idcard_list[4]) +
                 int(idcard_list[14])) * 8 + \
                (int(idcard_list[5]) +
                 int(idcard_list[15])) * 4 + \
                (int(idcard_list[6]) +
                 int(idcard_list[16])) * 2 + \
                int(idcard_list[7]) * 1 + \
                int(idcard_list[8]) * 6 + \
                int(idcard_list[9]) * 3
            Y = S % 11
            M = "F"
            JYM = "10X98765432"
            M = JYM[Y]  # 判断校验位
            if not (M == idcard_list[17]):  # 检测ID的校验位
                return JsonResponse({'result': False, 'code': 10064, 'msg': Errors[3]})
        else:
            return JsonResponse({'result': False, 'code': 10063, 'msg': Errors[2]})
    else:
        return JsonResponse({'result': False, 'code': 10062, 'msg': Errors[1]})


# 通过url获取到阿里云的url链接
def get_avatar_url(url):
    if url is None or url == "":
        return ""
    if url.startswith("http"):
        return url
    return settings.ACCOUNT_AVATAR_HOST + "/" + url


def check_password(password):
    """
    密码要求
    1 至少8位
    2 大小写+数字
    """
    try:
        MinimumLengthValidator().validate(password)
    except ValidationError:
        return False, '密码至少需要设置8位'
    if re.match(r'^(?=.*[A-Za-z])(?=.*[0-9])\w{8,}$', password):
        return True, ''
    else:
        return False, '密码应该为大小写字母与数字的组合'


# 手机号码加*进行隐藏
def format_api_key(key):
    return key[:5] + '*' * 5


def generate_api_key():
    """
    获取API_Key
    :return:
    """
    return str(uuid.uuid4())


def generate_api_secret():
    """
    获取API_Secret
    :return:
    """
    return generate_random_token()[:32]
