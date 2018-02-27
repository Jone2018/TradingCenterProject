# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import base64
import datetime
import hmac
import json
import logging
import re
import time
from hashlib import sha1 as sha

from captcha.models import CaptchaStore
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.password_validation import (
    MinimumLengthValidator
)
from django.core.exceptions import ValidationError
from django.core.urlresolvers import reverse
from django.core.validators import EmailValidator, validate_ipv4_address
from django.db import transaction
from django.db.transaction import atomic
from django.db.utils import IntegrityError
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_POST
from phonenumber_field.phonenumber import PhoneNumber

from django.conf import settings
from .decorators import login_required
from .models import (
    User, PhoneCaptcha, EmailConfirmation, EmailCaptcha, Realname, Profile, APIPermission, APISecret, IPAllowedAccessAPI
)
from .utils import check_password as _check_password
from .utils import get_user_info, checkIdcard, generate_api_key, generate_api_secret, format_api_key
from .validators import PhoneNumberValidator

logger = logging.getLogger(__name__)


@require_GET
def get_captcha(request):
    try:
        hashkey = CaptchaStore.pick()
        captcha_url = reverse('account:captcha-image', args=[hashkey])
        return JsonResponse({'result': True, 'data': {'captcha_url': captcha_url}})
    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10002, 'msg': '获取图像验证码失败'})


@require_POST
def send_email_confirmation(request):
    try:
        if request.POST['email']:
            try:
                EmailValidator()(request.POST['email'])
            except ValidationError as e:
                return JsonResponse({'result': False, 'code': 10050, 'msg': '邮件地址格式错误'})

            EmailConfirmation.remove_expired()
            if EmailConfirmation.objects.filter(email=request.POST['email'], expiration__gt=timezone.now()).exists():
                return JsonResponse({'result': False, 'code': 10051, 'msg': '激活邮件已发送，请耐心等待'})
            else:
                try:
                    EmailConfirmation.objects.create(email=request.POST['email']).send()
                    return JsonResponse({'result': True, 'data': {'status': 1}})
                except Exception as e:
                    logger.error(e)
                    return JsonResponse({'result': False, 'code': 10053, 'msg': '邮件发送失败'})
        else:
            return JsonResponse({'result': False, 'code': 10052, 'msg': '邮件地址不能为空'})
    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数错误'})


@require_GET
def confirm_email(request, key):
    try:
        EmailConfirmation.remove_expired()
        with transaction.atomic():
            obj = EmailConfirmation.objects.get(key=key, expiration__gt=timezone.now())
            user = User.objects.get(email=obj.email)
            user.is_email_verified = True
            user.is_active = True
            user.save()
            obj.delete()
        return JsonResponse({'result': True, 'data': {'status': 1}})
    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10054, 'msg': '邮件激活失败'})


@require_POST
def send_phone_captcha(request):
    try:
        if request.POST['phone_number']:
            try:
                phone_number = PhoneNumber.from_string(request.POST['phone_number'])
                PhoneNumberValidator(phone_number)
            except ValidationError as e:
                return JsonResponse({'result': False, 'code': 10003, 'msg': '手机号码格式不正确'})

            PhoneCaptcha.remove_expired()
            if PhoneCaptcha.objects.filter(phone_number=phone_number.as_e164,
                                           expiration__gt=timezone.now()).exists():
                return JsonResponse({'result': False, 'code': 10004, 'msg': '短信发送请求过于频繁，请稍后再试'})
                # return JsonResponse({'result': False, 'code': 10004, 'msg': '手机验证码已发送，请耐心等待'})
            else:
                try:
                    sms_result = PhoneCaptcha.objects.create(phone_number=phone_number.as_e164).send()
                    if sms_result.get('result') == 1:
                        return JsonResponse({'result': True, 'data': {'status': 1}})
                    elif sms_result.get('result') == 2:
                        return JsonResponse({'result': False, 'code': 10004, 'msg': '短信发送请求过于频繁，请稍后再试'})
                    else:
                        return JsonResponse({'result': False, 'code': 10005, 'msg': '手机验证码发送失败'})
                except Exception as e:
                    logger.error(e)
                    return JsonResponse({'result': False, 'code': 10005, 'msg': '手机验证码发送失败'})
        else:
            return JsonResponse({'result': False, 'code': 10006, 'msg': '手机号码不能为空'})
    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数错误'})


@require_POST
def send_email_captcha(request):
    try:
        if request.POST['email']:
            try:
                email = request.POST['email']
                EmailValidator(email)
            except ValidationError as e:
                return JsonResponse({'result': False, 'code': 10050, 'msg': '电子邮箱格式不正确'})

            EmailCaptcha.remove_expired()
            if EmailCaptcha.objects.filter(email=email,
                                           expiration__gt=timezone.now()).exists():
                return JsonResponse({'result': False, 'code': 10051, 'msg': '邮箱验证码已发送，请耐心等待'})
            else:
                try:
                    if request.user.is_authenticated:
                        EmailCaptcha.objects.create(email=email).send(username=request.user.username)
                        return JsonResponse({'result': True, 'data': {'status': 1}})
                    else:
                        EmailCaptcha.objects.create(email=email).send()
                        return JsonResponse({'result': True, 'data': {'status': 1}})
                except Exception as e:
                    logger.error(e)
                    return JsonResponse({'result': False, 'code': 10053, 'msg': '邮箱验证码发送失败'})
        else:
            return JsonResponse({'result': False, 'code': 10052, 'msg': '邮箱地址不能为空'})
    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数错误'})


@login_required
@require_POST
def set_phone_number(request):
    try:
        if request.POST['captcha'] and request.POST['phone_number']:
            PhoneCaptcha.remove_expired()
            try:
                PhoneCaptcha.objects.get(response=request.POST['captcha'], phone_number=request.POST['phone_number'],
                                         expiration__gt=timezone.now()).delete()
            except PhoneCaptcha.DoesNotExist:
                return JsonResponse({'result': False, 'code': 10007, 'msg': '验证码校验失败'})

            try:
                phone_number = PhoneNumber.from_string(request.POST['phone_number'])
                PhoneNumberValidator(phone_number)
            except ValidationError as e:
                return JsonResponse({'result': False, 'code': 10003, 'msg': '手机号码格式不正确'})

            user = request.user
            if user.is_phone_verified and user.phone_number == phone_number:
                return JsonResponse({'result': False, 'code': 10057, 'msg': '该手机号码与原手机号码一致，请更换手机号码'})

            if User.objects.filter(phone_number=phone_number).exists():
                return JsonResponse({'result': False, 'code': 10020, 'msg': '该手机号码已被注册'})

            user.phone_number = phone_number
            user.is_phone_verified = True
            user.save()
            return JsonResponse({'result': True, 'data': {'status': 1}})
        else:
            return JsonResponse({'result': False, 'code': 10008, 'msg': '验证码不能为空'})
    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数错误'})


@require_POST
def email_signup(request):
    try:
        if request.POST['email'] and request.POST['password'] and request.POST['password2']:
            try:
                EmailValidator()(request.POST['email'])
            except ValidationError as e:
                return JsonResponse({'result': False, 'code': 10050, 'msg': '邮件地址格式错误'})

            if request.POST["password"] != request.POST["password2"]:
                return JsonResponse({'result': False, 'code': 10009, 'msg': '两次输入的密码不一致'})

            _password_validate_result, _password_validate_msg = _check_password(request.POST["password"])

            if not _password_validate_result:
                return JsonResponse({'result': False, 'code': 10010, 'msg': _password_validate_msg})

            try:
                with atomic():
                    User.objects.create_user(username=request.POST['email'], email=request.POST['email'],
                                             password=request.POST['password'], is_active=False)
                    num_sent = EmailConfirmation.objects.create(email=request.POST['email']).send()
                    if num_sent:
                        return JsonResponse({'result': True, 'data': {'msg': '已发送激活邮件，请查收'}})
            except (KeyError, IntegrityError) as e:
                logger.error(e)
                return JsonResponse({'result': False, 'code': 10055, 'msg': '该邮件地址已被注册'})
            except Exception as e:
                logger.error(e)
                return JsonResponse({'result': False, 'code': 10011, 'msg': '用户注册失败'})
    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数错误'})


@require_POST
def user_signup(request):
    try:
        #     CaptchaStore.remove_expired()
        #     try:
        #         CaptchaStore.objects.get(response=request.POST['captcha_value'],
        # hashkey=request.POST['captcha_key'], expiration__gt=timezone.now()).delete()
        #     except CaptchaStore.DoesNotExist:
        #         return JsonResponse({'result':False, 'code': 10007, 'msg': '验证码校验失败'})
        # else:
        #     return JsonResponse({'result':False, 'code': 10008, 'msg': '验证码不能为空'})

        if request.POST['captcha'] and request.POST['phone_number']:
            PhoneCaptcha.remove_expired()
            try:
                PhoneCaptcha.objects.get(response=request.POST['captcha'], phone_number=request.POST['phone_number'],
                                         expiration__gt=timezone.now()).delete()
            except PhoneCaptcha.DoesNotExist:
                return JsonResponse({'result': False, 'code': 10007, 'msg': '验证码校验失败'})

            try:
                phone_number = PhoneNumber.from_string(request.POST['phone_number'])
                PhoneNumberValidator(phone_number)
            except ValidationError as e:
                return JsonResponse({'result': False, 'code': 10003, 'msg': '手机号码格式不正确'})
        else:
            return JsonResponse({'result': False, 'code': 10008, 'msg': '验证码不能为空'})

        if request.POST['password'] and request.POST['password2']:
            # try:
            #     UsernameValidator()(request.POST['username'])
            # except ValidationError as e:
            #     return JsonResponse({'result':False, 'code': 10014, 'msg': e.message})

            if request.POST["password"] != request.POST["password2"]:
                return JsonResponse({'result': False, 'code': 10009, 'msg': '两次输入的密码不一致'})

            try:
                MinimumLengthValidator().validate(request.POST["password"])
            except ValidationError as e:
                return JsonResponse({'result': False, 'code': 10010, 'msg': e.message})

            try:
                if User.objects.filter(username=phone_number.as_e164).exists():
                    return JsonResponse({'result': False, 'code': 10020, 'msg': '该手机号码已注册'})

                user = User.objects.create_user(username=phone_number.as_e164,
                                                password=request.POST['password'],
                                                phone_number=phone_number, is_phone_verified=True)
            except Exception as e:
                logger.error(e)
                return JsonResponse({'result': False, 'code': 10011, 'msg': '用户注册失败'})

            # try:
            #     NumericPasswordValidator().validate(self.cleaned_data["password"])
            # except:
            #     return JsonResponse({'result':False, 'code': 10010, 'msg': '密码不能全部为数字'})
            # CommonPasswordValidator().validate(self.cleaned_data["password"])

            if user is not None:
                login(request, user, 'django.contrib.auth.backends.ModelBackend')
                data = get_user_info(user)
                return JsonResponse({
                    'result': True,
                    'data': data
                })
            else:
                return JsonResponse({'result': False, 'code': 10012, 'msg': '用户名或密码错误'})
        else:
            return JsonResponse({'result': False, 'code': 10013, 'msg': '用户名或密码不能为空'})
    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数错误'})


@require_POST
def user_login(request):
    try:
        if request.POST['captcha_value']:
            CaptchaStore.remove_expired()
            try:
                CaptchaStore.objects.get(response=request.POST['captcha_value'], hashkey=request.POST['captcha_key'],
                                         expiration__gt=timezone.now()).delete()
            except CaptchaStore.DoesNotExist as e:
                logger.error(e)
                return JsonResponse({'result': False, 'code': 10007, 'msg': '验证码校验失败'})
        else:
            return JsonResponse({'result': False, 'code': 10008, 'msg': '验证码不能为空'})

        if request.POST['username'] and request.POST['password']:

            try:
                EmailValidator()(request.POST['username'])
                email = request.POST['username']
                try:
                    user = User.objects.get(email=email)
                    if user is not None:
                        if not user.is_active:
                            num_sent = EmailConfirmation.objects.create(email=email).send()
                            if num_sent:
                                return JsonResponse({'result': False, 'code': 10015, 'msg': '用户未激活,已重新发送激活邮件，请检查激活邮件'})
                                # return JsonResponse({'result': True, 'data': {'msg': '用户未激活,已重新发送激活邮件，请检查激活邮件'}})
                                # return JsonResponse({'result': False, 'code': 10015, 'msg': '用户未激活,已重新发送激活邮件，请检查激活邮件'})
                except User.DoesNotExist as e:
                    logger.error(e)
                    return JsonResponse({'result': False, 'code': 10056, 'msg': '该账户不存在，请核对后重新输入'})
                user = authenticate(email=email, password=request.POST['password'])
            except ValidationError as e:
                try:
                    phone_number = PhoneNumber.from_string(request.POST['username'])
                    PhoneNumberValidator(phone_number)
                    user = authenticate(phone_number=phone_number.as_e164, password=request.POST['password'])
                    logger.error(e)
                except ValidationError as e:
                    logger.error(e)
                    return JsonResponse({'result': False, 'code': 10056, 'msg': '手机号码或邮件地址格式不正确'})

            if user is not None:
                if user.is_active:
                    login(request, user, 'django.contrib.auth.backends.ModelBackend')
                    data = get_user_info(user)
                    return JsonResponse({
                        'result': True,
                        'data': data
                    })
                else:
                    return JsonResponse({'result': False, 'code': 10015, 'msg': '用户未激活'})
            else:
                return JsonResponse({'result': False, 'code': 10012, 'msg': '用户名或密码错误'})
        else:
            return JsonResponse({'result': False, 'code': 10013, 'msg': '用户名或密码不能为空'})
    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数错误'})


@login_required
@require_GET
def user_logout(request):
    try:
        logout(request)
        return JsonResponse({'result': True, 'data': {'status': 1}})

    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数错误'})


@ensure_csrf_cookie
@login_required
@require_GET
def user_info(request):
    if request.user.is_active:
        data = get_user_info(request.user)
        return JsonResponse({
            'result': True,
            'data': data
        })
    else:
        logout(request)
        return JsonResponse({'result': False, 'code': 10000, 'msg': '用户被禁用'})


@login_required
@require_GET
def auth_info(request):
    try:
        user = request.user
        try:
            realname = Realname.objects.get(user=user)
            data = {
                "realname": realname.realname,
                "id_type": realname.id_type,
                "id_card_no": realname.id_card_no,
                "create_time": realname.create_time,
                "has_pic_front": realname.pic_front is not None,
                "has_pic_back": realname.pic_back is not None,
                "has_pic_handon": realname.pic_handon is not None,
                "info_status": realname.info_status,
                "pic_status": realname.pic_status,
            }
            return JsonResponse({'result': True, 'data': data})
        except Realname.DoesNotExist:
            return JsonResponse({'result': False, 'code': 10111, 'msg': '尚未进行实名认证'})
    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10112, 'msg': '获取实名认证信息失败'})


@login_required
@require_POST
def set_trade_password(request):
    try:
        if request.POST['captcha'] and request.POST['captcha_type'] and request.POST['trade_password'] and request.POST[
            'trade_password2']:
            if not re.match(r'\d{6}', request.POST['trade_password']):
                return JsonResponse({'result': False, 'code': 10007, 'msg': '请输入正确的交易密码（6位纯数字f）'})
            PhoneCaptcha.remove_expired()
            EmailCaptcha.remove_expired()
            try:
                if request.POST['captcha_type'] == 'phone':
                    try:
                        PhoneCaptcha.objects.get(response=request.POST['captcha'],
                                                 phone_number=request.POST['phone_number'],
                                                 expiration__gt=timezone.now()).delete()

                    except:
                        return JsonResponse({'result': False, 'code': 10007, 'msg': '验证码校验失败'})
                    user = User.objects.get(phone_number=request.POST['phone_number'], is_phone_verified=True)
                    if user is None:
                        return JsonResponse({'result': False, 'code': 10019, 'msg': '该手机号码未注册'})
                elif request.POST['captcha_type'] == 'email':
                    try:
                        EmailCaptcha.objects.get(response=request.POST['captcha'], email=request.POST['email'],
                                                 expiration__gt=timezone.now()).delete()
                    except:
                        return JsonResponse({'result': False, 'code': 10007, 'msg': '验证码校验失败'})
                    user = User.objects.get(email=request.POST['email'], is_email_verified=True)
                    if user is None:
                        return JsonResponse({'result': False, 'code': 10019, 'msg': '该邮箱未注册'})
                user = request.user
                # todo 增加重置密码功能后，该条件判断变的冗余。后续须讨论重置密码流程
                # if user.is_set_password and not check_password(request.POST['old_trade_pwd'], user.trade_password):
                #     return JsonResponse({'result': False, 'code': 10009, 'msg': '原交易密码错误！'})
                if request.POST['trade_password'] != request.POST['trade_password2']:
                    return JsonResponse({'result': False, 'code': 10009, 'msg': '两次输入的密码不一致'})
                if user.is_set_password and check_password(user.trade_password,
                                                           make_password(request.POST['trade_password'])):
                    return JsonResponse({'result': False, 'code': 10059, 'msg': '交易密码不能与原交易密码一致'})
                user.trade_password = make_password(request.POST['trade_password'])
                user.is_set_password = True
                user.save()
                return JsonResponse({'result': True, 'data': {'status': 1}})
            except PhoneCaptcha.DoesNotExist:
                return JsonResponse({'result': False, 'code': 10007, 'msg': '验证码校验失败'})
        else:
            return JsonResponse({'result': False, 'code': 10008, 'msg': '验证码不能为空'})
    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数错误'})


@require_POST
def reset_password(request):
    try:
        if request.POST['captcha'] and request.POST['phone_number']:
            PhoneCaptcha.remove_expired()
            try:

                PhoneCaptcha.objects.get(response=request.POST['captcha'], phone_number=request.POST['phone_number'],
                                         expiration__gt=timezone.now()).delete()

                user = User.objects.get(phone_number=request.POST['phone_number'], is_phone_verified=True)
                if user is None:
                    return JsonResponse({'result': False, 'code': 10019, 'msg': '该手机号码未注册'})

                try:
                    MinimumLengthValidator().validate(request.POST["password"])
                except ValidationError as e:
                    logger.error(e)
                    return JsonResponse({'result': False, 'code': 10010, 'msg': e.message})

                # user = request.user
                user.password = make_password(request.POST['password'])
                user.save()
                return JsonResponse({'result': True, 'data': {'status': 1}})
            except PhoneCaptcha.DoesNotExist:
                return JsonResponse({'result': False, 'code': 10007, 'msg': '验证码校验失败'})
        else:
            return JsonResponse({'result': False, 'code': 10008, 'msg': '验证码不能为空'})
    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数错误'})


@login_required
@require_POST
def change_password(request):
    try:
        if request.POST['old_password'] and request.POST['new_password']:
            user = request.user
            if check_password(request.POST['old_password'], user.password):
                try:
                    MinimumLengthValidator().validate(request.POST["new_password"])
                except ValidationError as e:
                    return JsonResponse({'result': False, 'code': 10010, 'msg': e.message})

                user.password = make_password(request.POST['new_password'])
                user.save()
                return JsonResponse({'result': True, 'data': {'status': 1}})
            else:
                return JsonResponse({'result': False, 'code': 10016, 'msg': '输入密码错误'})
        else:
            return JsonResponse({'result': False, 'code': 10017, 'msg': '密码不能为空'})
    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数错误'})


# @login_required
# @require_POST
# def set_account_profile(request):
#     try:
#         if request.POST['nickname']:
#             user = request.user
#             user.profile.nickname = request.POST['nickname']
#             user.profile.avatar.url = request.Post['avatar_url']
#             try:
#                 user.save()
#             except Exception as e:
#                 return JsonResponse({'result': False, 'code': 10020, 'msg': ''})
#             return JsonResponse({'result': True, 'data': {'status': 1}})
#
#     except Exception as e:
#         return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数错误'})


@login_required
@require_GET
def verify_phoneOremail(request):
    try:
        type = int(request.GET['type'])
        setting_str = request.GET['setting_str']
        captcha = request.GET['captcha']
        user = request.user
    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数错误'})
    if type == 1:
        try:
            PhoneCaptcha.objects.get(response=captcha, phone_number=setting_str,
                                     expiration__gt=timezone.now()).delete()
            return JsonResponse({'result': True, 'data': {'status': 1}})
        except PhoneCaptcha.DoesNotExist:
            return JsonResponse({'result': False, 'code': 10007, 'msg': '验证码校验失败'})
    elif type == 2:
        try:
            EmailCaptcha.objects.get(response=captcha, email=setting_str, expiration__gt=timezone.now())
            return JsonResponse({'result': True, 'data': {'status': 1}})
        except Exception as e:
            logger.error(e)
            return JsonResponse({'result': False, 'code': 10007, 'msg': '验证码校验失败'})
    else:
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数错误'})


@login_required
@require_POST
def set_email(request):
    try:
        if request.POST['captcha'] and request.POST['email']:
            EmailCaptcha.remove_expired()
            try:
                EmailCaptcha.objects.get(response=request.POST['captcha'], email=request.POST['email'],
                                         expiration__gt=timezone.now()).delete()
                user = request.user
                # print user.is_email_verified
                # print user.email
                if user.is_email_verified and user.email == request.POST['email']:
                    return JsonResponse({'result': False, 'code': 10057, 'msg': '该邮箱与原邮箱一致，请更换邮箱地址'})
                if User.objects.filter(email=request.POST['email']).exists():
                    return JsonResponse({'result': False, 'code': 10068, 'msg': '电子邮箱已被绑定'})
                user.email = request.POST['email']
                user.is_email_verified = True
                # try:
                user.save()
                # except IntegrityError as e:
                #     return JsonResponse({'result': False, 'code': 10055, 'msg': '邮件地址已注册'})
                return JsonResponse({'result': True, 'data': {'status': 1}})
            except EmailCaptcha.DoesNotExist:
                return JsonResponse({'result': False, 'code': 10007, 'msg': '验证码校验失败'})
        else:
            return JsonResponse({'result': False, 'code': 10008, 'msg': '验证码不能为空'})
    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数错误'})


def get_iso_8601(expire):
    # print expire
    gmt = datetime.datetime.fromtimestamp(expire).isoformat()
    gmt += 'Z'
    return gmt


@login_required
@require_GET
def get_token(request):
    try:
        accessKeyId = settings.ACCOUNT_ACCID
        accessKeySecret = settings.ACCOUNT_ACCKEY
        host = settings.ACCOUNT_HOST
        expire_time = settings.ACCOUNT_EXPIRETIME
        upload_dir = settings.ACCOUNT_BASEDIR + request.user.username + "/"
        # now = int(time.time())
        # expire_syncpoint = now + expire_time
        # expire = get_iso_8601(expire_syncpoint)

        now = int(time.time())
        expire_syncpoint = now + expire_time
        expire = get_iso_8601(expire_syncpoint)

        policy_dict = {}
        policy_dict['expiration'] = expire
        condition_array = []
        array_item = []
        array_item.append('starts-with');
        array_item.append('$key');
        array_item.append(upload_dir);
        condition_array.append(array_item)
        policy_dict['conditions'] = condition_array
        policy = json.dumps(policy_dict).strip()
        # policy_encode = base64.encodestring(policy)
        policy_encode = base64.b64encode(policy)

        h = hmac.new(str(accessKeySecret), str(policy_encode), sha)

        sign_result = base64.encodestring(h.digest()).strip()

        token_dict = {}
        token_dict['accessid'] = accessKeyId
        token_dict['host'] = 'http://' + host
        token_dict['policy'] = policy_encode
        token_dict['signature'] = sign_result
        token_dict['expire'] = expire_syncpoint
        token_dict['dir'] = upload_dir
        # web.header("Access-Control-Allow-Methods", "POST")
        # web.header("Access-Control-Allow-Origin", "*")
        # print "d"
        # # web.header('Content-Type', 'text/html; charset=UTF-8')
        # result = json.dumps(token_dict)

        return JsonResponse(token_dict)
    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数错误'})


@login_required
@require_POST
def set_account_profile(request):
    try:
        nickname = request.POST['nickname']
        avatar = request.POST['avatar_url']
        user = request.user
    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数错误'})
    try:
        profile = Profile.objects.filter(nickname=nickname).first()
        if profile is None:
            if Profile.objects.filter(user=user).exists():
                Profile.objects.filter(user=user).update(nickname=nickname, avatar=avatar)
            else:
                Profile.objects.create(user=user, nickname=nickname, avatar=avatar)
            return JsonResponse({'result': True, 'data': {'status': 1}})
        else:
            if profile.user.id == user.id:
                profile.update(nickname=nickname, avatar=avatar)
                return JsonResponse({'result': True, 'data': {'status': 1}})
            else:
                return JsonResponse({'result': False, 'code': 10069, 'msg': '该昵称已被占用，请更换后重新尝试'})
    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10067, 'msg': '用户资料修改失败'})


@login_required
@require_POST
def set_realname(request):
    try:
        id_type = int(request.POST['id_type'])
        # TODO 当前仅支持【身份证认证】后期需要支持更多证件类型
        if id_type not in (0,):
            return JsonResponse({'result': False, 'code': 10113, 'msg': '不支持的证件类型'})
        id_card_no = request.POST['id_card_no']
        checkIdcard(id_card_no)
        realname = request.POST['realname']
        if realname is None:
            return JsonResponse({'result': False, 'code': 10061, 'msg': '真实姓名不能为空'})
        pic_front = request.POST['pic_front']
        if pic_front is None:
            return JsonResponse({'result': False, 'code': 10062, 'msg': '请上传身份证正面照片'})
        pic_back = request.POST['pic_back']
        if pic_back is None:
            return JsonResponse({'result': False, 'code': 10063, 'msg': '请上传身份证反面照片'})
        pic_handon = request.POST['pic_handon']
        if pic_handon is None:
            return JsonResponse({'result': False, 'code': 10064, 'msg': '请上传手持身份证照片'})
        user = request.user
    except:
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数错误'})
    try:
        Realname.objects.update_or_create(
            user=user,
            defaults={
                'user': user,
                # 'id_type': id_type,
                'id_card_no': id_card_no,
                'realname': realname,
                'pic_front': pic_front,
                'pic_back': pic_back,
                'pic_handon': pic_handon,
                'info_status': 0,
                'pic_status': 0,
            }
        )
        user.is_realname_verified = False
        user.save()
        return JsonResponse({'result': True, 'data': {'status': 1}})
    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10066, 'msg': '用户实名认证提交失败'})


@login_required
@require_GET
def get_is_read(request):
    try:
        user = request.user
        profile = Profile.objects.get(user__id=user.id)
        return JsonResponse({'result': True, 'data': {'status': 1, 'is_read': profile.is_read}})
    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数错误'})


@login_required
@require_GET
def set_is_read(request):
    try:
        user = request.user
        profile = Profile.objects.get(user__id=user.id)
        if not profile.is_read:
            profile.is_read = True
            profile.read_time = timezone.now()
            profile.save()
        return JsonResponse({'result': True, 'data': {'status': 1}})
    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数错误'})


@require_POST
def email_reset_password(request):
    try:
        if request.POST['captcha'] and request.POST['email']:
            EmailCaptcha.remove_expired()
            try:

                EmailCaptcha.objects.filter(response=request.POST['captcha'], email=request.POST['email'],
                                            expiration__gt=timezone.now()).delete()

                user = User.objects.filter(email=request.POST['email'], is_email_verified=True).first()
                if user is None:
                    return JsonResponse({'result': False, 'code': 10019, 'msg': '该邮箱未注册'})

                _password_validate_result, _password_validate_msg = _check_password(request.POST["password"])

                if not _password_validate_result:
                    return JsonResponse({'result': False, 'code': 10010, 'msg': _password_validate_msg})

                # user = request.user
                user.password = make_password(request.POST['password'])
                user.save()
                return JsonResponse({'result': True, 'data': {'status': 1}})
            except PhoneCaptcha.DoesNotExist:
                return JsonResponse({'result': False, 'code': 10007, 'msg': '验证码校验失败'})
            except Exception as e:
                logger.error(e)
                return JsonResponse({'result': False, 'code': 10019, 'msg': '重置密码失败'})
        else:
            return JsonResponse({'result': False, 'code': 10008, 'msg': '验证码不能为空'})
    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数错误'})


@login_required
def get_api_permission_list(request):
    try:
        api_permissions = APIPermission.objects.all()
        list_api_permissions = [{'id': p.pk, 'name': p.name} for p in api_permissions]
        return JsonResponse({'result': True, 'data': list_api_permissions})
    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数错误'})


@login_required
@require_POST
def create_api_key_pair(request):
    """
    用户创建密钥对
    限制密钥对数量为settings.MAX_API_KEY_PAIR_NUM
    :param request:
    :return:
    """
    try:
        phone_number = request.POST.get('phone_number')
        phone_captcha = request.POST.get('captcha')
        permission_id = request.POST.get('permission', '1')
        comment = request.POST.get('comment')
        ip_allowed = request.POST.get('ip_allowed')

        if not all([phone_number, phone_captcha, comment]):
            logger.error('缺少请求参数')
            return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数错误'})
        try:
            permission = APIPermission.objects.get(pk=permission_id)
        except APIPermission.DoesNotExist:
            return JsonResponse({'result': False, 'code': 10095, 'msg': '该API权限不存在'})
        try:
            PhoneCaptcha.remove_expired()
            PhoneCaptcha.objects.get(response=str(phone_captcha),
                                     phone_number=str(phone_number),
                                     ).delete()
        except Exception as e:
            logger.error(e)
            return JsonResponse({'result': False, 'code': 10007, 'msg': '验证码校验失败'})

        if APISecret.objects.filter(user=request.user, comment=comment).exists():
            return JsonResponse({'result': False, 'code': 10097, 'msg': 'API密钥对描述不能重复'})
        if ip_allowed:
            try:
                validate_ipv4_address(ip_allowed)
            except ValidationError:
                return JsonResponse({'result': False, 'code': 10094, 'msg': 'IP地址格式错误'})

        if APISecret.objects.filter(user=request.user).count() >= settings.MAX_API_KEY_PAIR_NUM:
            return JsonResponse({'result': False, 'code': 10093, 'msg': 'API密钥对数量超过上限'})
        with atomic():
            api_key_pair = APISecret.objects.create(
                comment=comment,
                user=request.user,
                api_key=generate_api_key(),
                api_secret=generate_api_secret(),
                permission=permission
            )
            if ip_allowed:
                IPAllowedAccessAPI.objects.create(ip=ip_allowed, user=request.user, api_key_pair=api_key_pair)
        return JsonResponse({'result': True, 'data': {'status': 1}})
    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数错误'})


@login_required
def get_api_list(request):
    """***模糊Response"""
    current_tz = timezone.get_current_timezone()
    user_api_pairs = APISecret.objects.filter(user=request.user)
    ctx = [
        {
            'id': api.pk,
            'comment': api.comment,
            'key': format_api_key(api.api_key),
            'permission': api.permission.name,
            'create_at': current_tz.normalize(api.create_at).strftime('%Y-%m-%d %H:%M:%S'),  # 2017-09-01 14:27:53.0
        }
        for api in user_api_pairs
    ]
    return JsonResponse({'result': True, 'data': ctx})


@login_required
@require_POST
def get_api_detail(request):
    phone_number = request.POST.get('phone_number')
    phone_captcha = request.POST.get('captcha')
    api_key_pair_id = request.POST.get('id')

    current_tz = timezone.get_current_timezone()
    # 手机号码、验证码、api密钥对ID为必须参数
    if not all([phone_number, phone_captcha, api_key_pair_id]):
        logger.error('缺少请求参数')
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数错误'})

    try:
        PhoneCaptcha.remove_expired()
        PhoneCaptcha.objects.get(response=str(phone_captcha),
                                 phone_number=str(phone_number),
                                 ).delete()
    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10007, 'msg': '验证码校验失败'})

    try:
        api_detail = APISecret.objects.get(user=request.user, pk=api_key_pair_id)
        ctx = {
            'comment': api_detail.comment,
            'permission': api_detail.permission.name,
            'key': api_detail.api_key,
            'secret': api_detail.api_secret,
            'create_at': current_tz.normalize(api_detail.create_at).strftime('%Y-%m-%d %H:%M:%S')
            # 2017-09-01 14:27:53.0
        }
        return JsonResponse({'result': True, 'data': ctx})
    except APISecret.DoesNotExist:
        return JsonResponse({'result': False, 'code': 10096, 'msg': '该API密钥对不存在'})


@login_required
@require_POST
def update_api_info(request):
    phone_number = request.POST.get('phone_number')
    phone_captcha = request.POST.get('captcha')

    api_key_pair_id = request.POST.get('id')

    ip_allowed = request.POST.get('ip_allowed')
    permission_id = request.POST.get('permission')

    # 手机号码、验证码、api密钥对ID为必须参数
    # IP白名单、权限至少有一个
    if not all([phone_number, phone_captcha, api_key_pair_id]) and any([ip_allowed, permission_id]):
        logger.error('缺少请求参数')
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数错误'})

    try:
        PhoneCaptcha.remove_expired()
        PhoneCaptcha.objects.get(response=str(phone_captcha),
                                 phone_number=str(phone_number),
                                 ).delete()
    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10007, 'msg': '验证码校验失败'})

    try:
        int(permission_id)
    except ValueError:
        logger.error('权限ID格式错误： ', permission_id)
        return JsonResponse({'result': False, 'code': 10114, 'msg': '权限格式错误'})

    try:
        target_permission = APIPermission.objects.get(pk=permission_id)
    except APIPermission.DoesNotExist:
        return JsonResponse({'result': False, 'code': 10095, 'msg': '该API权限不存在'})
    if ip_allowed:
        try:
            validate_ipv4_address(ip_allowed)
        except ValidationError:
            return JsonResponse({'result': False, 'code': 10094, 'msg': 'IP地址格式错误'})
    # 验证目标密钥对是否存在
    if not APISecret.objects.filter(user=request.user, pk=api_key_pair_id).exists():
        return JsonResponse({'result': False, 'code': 10096, 'msg': '该API密钥对不存在'})

    target_api_key_pair = APISecret.objects.get(user=request.user, pk=api_key_pair_id)

    with atomic():
        # 更新权限
        if permission_id:
            target_api_key_pair.permission = target_permission
            target_api_key_pair.save()
        # 更新IP
        if ip_allowed:
            IPAllowedAccessAPI.objects.update_or_create({
                'ip': ip_allowed,
                'user': request.user,
                'api_key_pair': target_api_key_pair
            })
    return JsonResponse({'result': True, 'data': {'status': 1}})


@login_required
@require_POST
def delete_api_key_pair(request):
    phone_number = request.POST.get('phone_number')
    phone_captcha = request.POST.get('captcha')

    api_key_pair_id = request.POST.get('id')

    # 手机号码、验证码、api密钥对ID为必须参数
    if not all([phone_number, phone_captcha, api_key_pair_id]):
        logger.error('缺少请求参数')
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数错误'})

    try:
        PhoneCaptcha.remove_expired()
        PhoneCaptcha.objects.get(response=str(phone_captcha),
                                 phone_number=str(phone_number),
                                 ).delete()
    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10007, 'msg': '验证码校验失败'})
    if not APISecret.objects.filter(user=request.user, pk=api_key_pair_id).exists():
        return JsonResponse({'result': False, 'code': 10096, 'msg': '该API密钥对不存在'})

    # 做删除操作
    with atomic():
        APISecret.objects.get(user=request.user, pk=api_key_pair_id).delete()
    return JsonResponse({'result': True, 'data': {'status': 1}})
