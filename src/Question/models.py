# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import sys

from django.db import models
from django.utils import timezone

from Dic.conf import DIC_QUESTION_TYPE, DIC_QUESTION_STATUS
from .utils import unique_code

reload(sys)
sys.setdefaultencoding('utf-8')

# 选择项
QUESTION_TYPE_CHOICES = ((k, v) for (k, v) in DIC_QUESTION_TYPE.items())
QUESTION_STATUS_CHOICES = ((k, v) for (k, v) in DIC_QUESTION_STATUS.items())


# 工单
class Question(models.Model):
    user_id = models.IntegerField('用户ID', null=False, blank=False)
    question_code = models.CharField('工单编号', max_length=20, null=False, blank=False,
                                     unique=True, default=unique_code)

    content = models.CharField('问题描述', max_length=500, null=False, blank=False, unique=False)

    create_time = models.DateTimeField('创建日期', null=False, blank=False, default=timezone.now)

    update_time = models.DateTimeField('最近更新时间', auto_now=True)

    question_type = models.PositiveSmallIntegerField('类型', null=False, blank=False, default=4,
                                                     choices=QUESTION_TYPE_CHOICES)
    is_deleted = models.BooleanField('已删除', default=False)

    status = models.PositiveSmallIntegerField('状态', default=0, choices=QUESTION_STATUS_CHOICES)

    class Meta:
        ordering = ('create_time',)
        verbose_name = '工单'
        verbose_name_plural = '工单'

    def __unicode__(self):
        return self.content if len(self.content) < 10 else '%s...' % self.content[0:10]


# 回复
class Reply(models.Model):
    question = models.ForeignKey(Question, related_name='replies', verbose_name='回复',
                                 on_delete=models.CASCADE)
    content = models.CharField('回复内容', max_length=200, null=False, blank=False, unique=False)

    create_time = models.DateTimeField('创建日期', null=False, blank=False, default=timezone.now)

    class Meta:
        ordering = ('create_time',)
        verbose_name = '回复'
        verbose_name_plural = '回复'

    def __unicode__(self):
        return self.content if len(self.content) < 10 else '%s...' % self.content[0:10]
