# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import datetime
import sys

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.models import Group
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.core.mail import send_mail
from django.core.validators import EmailValidator, validate_ipv4_address
from django.db import models
from django.template.loader import render_to_string
from django.utils import timezone
from jsonfield import JSONField
from phonenumber_field.modelfields import PhoneNumberField

from .alimns import send_sms
from django.conf import settings
from .manager import UserManager
from .signals import user_action_logged
from .utils import generate_random_token, generate_random_code
from .validators import PhoneNumberValidator

reload(sys)
sys.setdefaultencoding('utf-8')
# 选择项
ID_TYPE_CHOICES = ((0, '身份证'), (1, '护照'))
REALNAME_STATUS_CHOICES = ((0, '审核中'), (1, '审核通过'), (2, '审核未通过'))


class User(AbstractBaseUser, PermissionsMixin):
    uid = models.IntegerField(
        '用户ID',
        unique=True,
        editable=False,
    )

    username = models.CharField(
        '用户名',
        max_length=255,
        unique=True,
        help_text='默认为uid',
        error_messages={
            'unique': '用户名已注册',
        },
    )

    phone_number = PhoneNumberField(
        '手机号码',
        unique=True,
        null=True,
        validators=[PhoneNumberValidator],
        error_messages={
            'unique': '电话号码已注册',
        },
    )

    email = models.EmailField(
        '电子邮件',
        unique=True,
        null=True,
        validators=[EmailValidator()],
        error_messages={
            'unique': '电子邮件已注册',
        },
    )

    trade_password = models.CharField(
        '交易密码',
        max_length=128
    )

    is_set_password = models.BooleanField(
        '交易密码是否设置',
        default=False
    )

    is_phone_verified = models.BooleanField(
        '手机号码是否已验证',
        default=False
    )

    is_email_verified = models.BooleanField(
        '电子邮件是否已验证',
        default=False
    )

    is_realname_verified = models.BooleanField(
        '是否已通过实名验证',
        default=False
    )

    is_staff = models.BooleanField(
        '是否为管理员',
        default=False,
        help_text='是否允许登录管理后台',
    )

    is_active = models.BooleanField(
        '是否有效',
        default=True,
        help_text='用户是否可用',
    )

    # last_login 最近登录时间
    date_joined = models.DateTimeField('创建时间', default=timezone.now)
    last_login_ip = models.GenericIPAddressField('最近登录IP', null=True, blank=True)

    objects = UserManager()

    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'username'

    # REQUIRED_FIELDS = ['email']

    class Meta:
        verbose_name = '用户'
        verbose_name_plural = '用户'

    def clean(self):
        super(User, self).clean()
        self.email = self.__class__.objects.normalize_email(self.email)

    def get_full_name(self):
        """
        Returns the first_name plus the last_name, with a space in between.
        """
        full_name = '%s' % self.username
        return full_name.strip()

    def get_short_name(self):
        "Returns the short name for the user."
        return self.username

    def send_phone_captcha(self, code):
        return send_sms(self.phone_number, "SMS_78715112", {'code': code})

    def send_email(self, subject, message, **kwargs):
        send_mail(subject, message, settings.EMAIL_HOST_USER, [self.email], **kwargs)

    def save(self, *args, **kwargs):
        if not self.email:
            self.email = None
        super(User, self).save(*args, **kwargs)


# 用户操作记录
class Action(models.Model):
    user = models.ForeignKey(User, related_name='action', verbose_name='用户',
                             null=True, on_delete=models.SET_NULL)
    timestamp = models.DateTimeField(default=timezone.now, db_index=True)
    action = models.CharField(max_length=50, db_index=True)
    content_type = models.ForeignKey(ContentType, null=True, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField(null=True)
    obj = GenericForeignKey("content_type", "object_id")
    extra = JSONField()

    class Meta:
        verbose_name = '用户操作记录'
        verbose_name_plural = '用户操作记录'
        ordering = ["-timestamp"]


# 记录资金变化历史
def log_user_action(user, action, obj=None, extra=None, dateof=None):
    if extra is None:
        extra = {}
    content_type = None
    object_id = None
    if obj is not None:
        content_type = ContentType.objects.get_for_model(obj)
        object_id = obj.pk
    if dateof is None:
        dateof = timezone.now()

    event = Action.objects.create(
        user=user,
        action=action,
        extra=extra,
        content_type=content_type,
        object_id=object_id,
        timestamp=dateof
    )
    user_action_logged.send(sender=Action, event=event)
    return event


class Profile(models.Model):
    user = models.OneToOneField(User, related_name="profile", verbose_name="用户", on_delete=models.CASCADE)
    nickname = models.CharField('昵称', max_length=255, blank=True)
    avatar = models.URLField('头像', max_length=200)

    is_read = models.BooleanField(
        '用户协议是否已阅读',
        default=False
    )

    read_time = models.DateTimeField(
        '阅读时间',
        default=timezone.now
    )

    class Meta:
        verbose_name = '用户属性'
        verbose_name_plural = '用户属性'


class Realname(models.Model):
    user = models.OneToOneField(User, related_name="realname", verbose_name="用户", on_delete=models.CASCADE)
    id_type = models.PositiveSmallIntegerField('证件类型', default=0, choices=ID_TYPE_CHOICES)
    id_card_no = models.CharField('证件号码', max_length=100, blank=True)
    realname = models.CharField('真实姓名', max_length=255, blank=True)
    pic_front = models.CharField('正面', max_length=200, null=True, blank=True)
    pic_back = models.CharField('反面', max_length=200, null=True, blank=True)
    pic_handon = models.CharField('手持', max_length=200, null=True, blank=True)
    create_time = models.DateTimeField('认证时间', null=False, blank=False, default=timezone.now)
    info_status = models.PositiveSmallIntegerField('信息审核状态', default=0, choices=REALNAME_STATUS_CHOICES)
    pic_status = models.PositiveSmallIntegerField('照片审核状态', default=0, choices=REALNAME_STATUS_CHOICES)

    class Meta:
        verbose_name = '用户实名属性'
        verbose_name_plural = '用户实名属性'


class LoginHistory(models.Model):
    user = models.ForeignKey(User, related_name="login_history", verbose_name="用户", on_delete=models.CASCADE)
    login_time = models.DateTimeField('登录时间', default=timezone.now)
    login_ip = models.GenericIPAddressField('登录IP')
    login_addr = models.CharField('登录地点', max_length=128)

    class Meta:
        verbose_name = '登录历史'
        verbose_name_plural = '登录历史'

    def __str__(self):
        return "用户{}于{}在{}登录".format(self.user, self.login_time, self.login_ip)


class ProxyGroup(Group):
    class Meta:
        proxy = True
        auto_created = True
        # If you're define ProxyReview inside review/models.py,
        #  its app_label is set to 'review' automatically.
        # Or else comment out following line to specify it explicitly               
        # app_label = 'review'

        # set following lines to display ProxyReview as Review
        verbose_name = Group._meta.verbose_name
        verbose_name_plural = Group._meta.verbose_name_plural


class PhoneCaptcha(models.Model):
    challenge = models.CharField(blank=False, max_length=32)
    response = models.CharField(blank=False, max_length=32)
    phone_number = PhoneNumberField(
        '手机号码',
        validators=[PhoneNumberValidator]
    )
    expiration = models.DateTimeField(blank=False)

    def save(self, *args, **kwargs):
        self.challenge = generate_random_code()
        self.response = self.challenge
        if not self.expiration:
            self.expiration = timezone.now() + datetime.timedelta(
                minutes=int(settings.ACCOUNT_PHONE_CONFIRMATION_MINUTES))
        super(PhoneCaptcha, self).save(*args, **kwargs)

    def __unicode__(self):
        return self.challenge

    def remove_expired(cls):
        cls.objects.filter(expiration__lte=timezone.now()).delete()

    remove_expired = classmethod(remove_expired)

    def send(self):
        return send_sms(self.phone_number, "SMS_78715112", {'code': self.challenge})


class EmailCaptcha(models.Model):
    challenge = models.CharField(blank=False, max_length=32)
    response = models.CharField(blank=False, max_length=32)
    # email = models.CharField(blank=False, max_length=32)
    email = models.EmailField(
        '电子邮件',
        # unique=True,
        # null=True,
        validators=[EmailValidator()],
        # error_messages={
        #     'unique': '电子邮件已注册',
        # },
    )
    expiration = models.DateTimeField(blank=False)

    def save(self, *args, **kwargs):
        self.challenge = generate_random_code()
        self.response = self.challenge
        if not self.expiration:
            self.expiration = timezone.now() + datetime.timedelta(
                minutes=int(settings.ACCOUNT_EMAIL_CONFIRMATION_MINUTES))
        super(EmailCaptcha, self).save(*args, **kwargs)

    def __unicode__(self):
        return self.challenge

    def remove_expired(cls):
        cls.objects.filter(expiration__lte=timezone.now()).delete()

    remove_expired = classmethod(remove_expired)

    def send(self, username=None, action=None):
        ctx = {
            'username': username if username else '',
            'action': action if action else '',
            'code': self.response,
            'interval': settings.ACCOUNT_EMAIL_CONFIRMATION_MINUTES,
            'time': timezone.localtime().strftime('%Y-%m-%d %H:%M:%S'),
        }
        message = render_to_string("account/email/email_captcha_subject.txt", ctx)
        send_mail("[随求]邮箱验证码", message, settings.EMAIL_HOST_USER, [self.email])


class EmailConfirmation(models.Model):
    email = models.EmailField(
        '电子邮件',
        validators=[EmailValidator()],
    )
    key = models.CharField(max_length=64, unique=True)
    expiration = models.DateTimeField(blank=False)

    def save(self, *args, **kwargs):
        self.key = generate_random_token()
        if not self.expiration:
            self.expiration = timezone.now() + datetime.timedelta(hours=int(settings.ACCOUNT_EMAIL_CONFIRMATION_HOURS))
        super(EmailConfirmation, self).save(*args, **kwargs)

    def __unicode__(self):
        return self.key

    def remove_expired(cls):
        cls.objects.filter(expiration__lte=timezone.now()).delete()

    remove_expired = classmethod(remove_expired)

    def send(self):
        site_name = settings.SITE_NAME
        protocol = getattr(settings, "DEFAULT_HTTP_PROTOCOL", "https")
        activate_url = "{0}://{1}{2}".format(
            protocol,
            site_name,
            '/api/account/confirm_email/{}/'.format(self.key)
        )
        ctx = {
            "email_address": self.email,
            "activate_url": activate_url,
            "site_name": site_name,
            "key": self.key,
        }
        subject = render_to_string("account/email/email_confirmation_subject.txt", ctx)
        subject = "".join(subject.splitlines())  # remove superfluous line breaks
        message = render_to_string("account/email/email_confirmation_message.txt", ctx)
        num_sent = send_mail(subject, message, settings.EMAIL_HOST_USER, [self.email])
        if not num_sent:
            raise Exception('Failed to send email.')  # 如果发送失败，则不新建未激活用户（rollback）
        return num_sent


class APIPermission(models.Model):
    name = models.CharField(max_length=255, unique=True, blank=False)


class APISecret(models.Model):
    user = models.ForeignKey(User, related_name="api_key_pair", verbose_name="用户", on_delete=models.CASCADE)
    api_key = models.CharField(max_length=255, unique=True, blank=False)
    api_secret = models.CharField(max_length=255, unique=True, blank=False)
    create_at = models.DateTimeField('创建时间', default=timezone.localtime)
    comment = models.CharField('备注名', blank=False, max_length=255, default='API')
    permission = models.ForeignKey(APIPermission, on_delete=models.CASCADE, null=False)


class IPAllowedAccessAPI(models.Model):
    ip = models.GenericIPAddressField('密钥对允许访问API的IP', protocol='both', null=False, blank=False,
                                      validators=[validate_ipv4_address])
    user = models.ForeignKey(User, verbose_name="用户", on_delete=models.CASCADE)
    api_key_pair = models.ForeignKey(APISecret, on_delete=models.CASCADE, verbose_name="密钥对")

    def save(self, *args, **kwargs):
        validate_ipv4_address(self.ip)
        super(IPAllowedAccessAPI, self).save(*args, **kwargs)
