# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from .models import Question, Reply


class ReplyInline(admin.StackedInline):
    extra = 0
    model = Reply
    readonly_fields = ('create_time',)
    can_delete = False
    verbose_name_plural = '工单回复'


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_id', 'question_code', 'question_type', 'content', 'create_time', 'status')
    fieldsets = (
        (None, {'fields': ('id', 'user_id', 'question_code', 'question_type', 'content', 'create_time')}),
        ('修改状态', {'fields': ('status',)}),
    )
    list_filter = ('question_type', 'create_time', 'status')
    search_fields = ('user_id', 'question_code', 'content')
    readonly_fields = ('id', 'user_id', 'question_code', 'content', 'create_time', 'update_time', 'question_type')
    inlines = (ReplyInline,)
    ordering = ('status', 'create_time')

    def get_actions(self, request):
        return None

    def has_delete_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request):
        return False
