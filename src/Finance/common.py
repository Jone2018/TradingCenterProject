# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from captcha.models import CaptchaStore
from django.db.models import Q
from django.http import JsonResponse
from django.utils import timezone

from Account.models import User, PhoneCaptcha, EmailCaptcha
from Dic.models import CoinType
from .exceptions import *
from .models import BalanceWithDraw, CoinTypeProperty


def fail(code=10001, message='请求参数格式错误'):
    return JsonResponse({'result': False, 'code': code, 'msg': message})


def success(data=None, **kwargs):
    if data is None:
        return JsonResponse({'result': True, 'data': {'status': 1}})
    else:
        response = dict({'result': True, 'data': data}, **kwargs)
        return JsonResponse(response)


def check_coin_type(coin_type):
    try:
        ct = CoinType.objects.get(id=coin_type)
        return ct.code
    except:
        raise CoinTypeNotFoundException(code=10033, message='找不到此币种，请确认币种信息')


def check_captcha(key, value):
    if value:
        CaptchaStore.remove_expired()
        try:
            CaptchaStore.objects.get(response=value, hashkey=key,
                                     expiration__gt=timezone.now()).delete()
        except CaptchaStore.DoesNotExist as e:
            raise CaptchaFailException(code=10007, message='验证码校验失败')
    else:
        raise CaptchaFailException(code=10008, message='验证码不能为空')


def check_phone_captcha(phone_number, captcha):
    if not User.objects.filter(phone_number=phone_number, is_phone_verified=True).exists():
        raise PhoneCaptchaFailException(code=10019, message='手机号码未注册或未通过认证')

    if captcha:
        PhoneCaptcha.remove_expired()
        try:
            PhoneCaptcha.objects.get(response=captcha,
                                     phone_number=phone_number,
                                     expiration__gt=timezone.now()).delete()
        except PhoneCaptcha.DoesNotExist:
            raise PhoneCaptchaFailException(code=10007, message='验证码校验失败')
    else:
        raise PhoneCaptchaFailException(code=10008, message='验证码不能为空')


def check_email_captcha(email, captcha):
    if not User.objects.filter(email=email, is_email_verified=True).exists():
        raise EmailCaptchaFailException(code=10019, message='电子邮件未注册或未通过认证')

    if captcha:
        EmailCaptcha.remove_expired()
        try:
            EmailCaptcha.objects.get(response=captcha,
                                     email=email,
                                     expiration__gt=timezone.now()).delete()
        except EmailCaptcha.DoesNotExist:
            raise EmailCaptchaFailException(code=10007, message='验证码校验失败')
    else:
        raise EmailCaptchaFailException(code=10008, message='验证码不能为空')


def check_withdraw_upper_limit(user, coin_type, amount):
    time_range = (timezone.now().date(), timezone.now())
    status_not = 14
    AMOUNTCOINTYPELIMIT = dict([(p.coin_type, p.day_limit) for p in CoinTypeProperty.objects.all()])
    bwds = BalanceWithDraw.objects.filter(
        address__user__id=user.id,
        address__coin_type=coin_type,
        create_time__range=time_range
    ).filter(~Q(status=status_not))
    if not len(bwds):
        return
    amount_sum = 0
    for bwd in bwds:
        amount_sum += bwd.amount
    if amount_sum + amount > AMOUNTCOINTYPELIMIT[coin_type]:
        raise AmountExceededLimitException(code=10073, message='今日提币金额已达上限')
