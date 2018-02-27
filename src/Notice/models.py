# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import sys

from django.db import models
from django.db.transaction import atomic
from django.utils import timezone

from Dic.conf import DIC_NOTICE_STATUS, DIC_NOTICE_TYPE, DIC_MESSAGE_TYPE

reload(sys)
sys.setdefaultencoding('utf-8')

# 选择项
NOTICE_STATUS_CHOICES = ((k, v) for (k, v) in DIC_NOTICE_STATUS.items())
NOTICE_TYPE_CHOICES = ((k, v) for (k, v) in DIC_NOTICE_TYPE.items())
MESSAGE_TYPE_CHOICES = ((k, v) for (k, v) in DIC_MESSAGE_TYPE.items())
LANG_CODE_CHOICES = (
    ('en', '英文'),
    ('zh-hans', '中文简体'),
    ('zh-hant', '中文繁体'),
)


# 公告
class Notice(models.Model):
    title = models.CharField('标题', max_length=100, null=False, blank=False)

    content = models.TextField('正文', max_length=30000)

    create_time = models.DateTimeField('创建日期', null=False, blank=False, default=timezone.now)

    view_count = models.IntegerField('阅读次数', null=False, blank=False, default=0)

    update_time = models.DateTimeField('最近更新时间', auto_now=True)

    author = models.CharField('作者', max_length=20, null=False, blank=False, default='随求交易所', unique=False)

    status = models.PositiveSmallIntegerField('状态', default=0, choices=NOTICE_STATUS_CHOICES)

    is_important = models.BooleanField('是否重要', default=False)

    is_valid = models.BooleanField('是否有效', default=True)

    title_img = models.URLField('标题图片', max_length=100, null=True, blank=True)

    banner_img = models.URLField('轮播图片', max_length=100, null=True, blank=True)

    notice_type = models.PositiveSmallIntegerField('类型', default=0, choices=NOTICE_TYPE_CHOICES)

    lang_code = models.CharField('语言', max_length=20, null=False, blank=False, default='zh-hans',
                                 choices=LANG_CODE_CHOICES)

    class Meta:
        ordering = ('create_time',)
        verbose_name = '公告'
        verbose_name_plural = '公告'

    def __unicode__(self):
        return self.title if len(self.title) < 10 else '%s...' % self.title[0:10]


# 站内消息
class Message(models.Model):
    title = models.CharField('标题', max_length=100, null=False, blank=False, unique=False)

    type = models.PositiveSmallIntegerField('类型', default=0, choices=MESSAGE_TYPE_CHOICES)

    content = models.TextField('正文', max_length=30000)

    create_time = models.DateTimeField('创建日期', null=False, blank=False, default=timezone.now)

    lang_code = models.CharField('语言', max_length=20, null=False, blank=False, default='zh-hans',
                                 choices=LANG_CODE_CHOICES)

    # 是否是发送给所有用户
    is_all_users = models.BooleanField('所有用户', default=False)

    class Meta:
        ordering = ('create_time',)
        verbose_name = '消息'
        verbose_name_plural = '消息'

    def __unicode__(self):
        return self.title if len(self.title) < 10 else '%s...' % self.title[0:10]


# 建立Message与User的伪多对多关联关系
class MessageUser(models.Model):
    message = models.ForeignKey(Message, related_name='users', verbose_name='用户',
                                null=True, on_delete=models.SET_NULL)
    is_deleted = models.BooleanField('已删除', default=False)

    is_read = models.BooleanField('已阅读', default=False)

    user_id = models.PositiveIntegerField(verbose_name='用户ID', null=True)

    class Meta:
        unique_together = (('message', 'user_id'),)


# 创建站内消息
def create_message(type, title, content, users=None):
    """
    Create a message object
    :param type: See DIC.conf.DIC_MESSAGE_TYPE for more details
    :param title:
    :param content:
    :param users: By default, select all
    :return:
    """
    if type not in DIC_MESSAGE_TYPE:
        raise Exception('The message type does not exist :{}'.format(type))
    try:
        message = Message()
        message.title = title
        message.content = content
        message.type = type
        message.is_all_users = users is None
        with atomic(using='service_db'):
            message.save()
            if users is not None:
                for user in users:
                    message_user = MessageUser()
                    message_user.message = message
                    message_user.user_id = user.id
                    message_user.save()
    except Exception as e:
        raise Exception('Failed to create message :{}'.format(e))
