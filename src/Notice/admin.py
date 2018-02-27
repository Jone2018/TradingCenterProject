# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from .models import Notice, Message, MessageUser


@admin.register(Notice)
class NoticeAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'title',
        'author',
        'create_time',
        'view_count',
        'update_time',
        'is_important',
        'is_valid',
        'lang_code',
        'status'
    )
    fieldsets = (
        (None, {
            'fields': (
                'id',
                'lang_code',
                'notice_type',
                'title',
                'content',
                'view_count',
                'author',
                'is_important',
                'is_valid',
                'title_img',
                'banner_img',
                'create_time'
            )
        }),
        ('修改状态', {
            'fields': ('status',)
        }),
    )
    list_filter = ('create_time', 'notice_type', 'status', 'lang_code')
    search_fields = ('title', 'content')
    readonly_fields = ('id', 'create_time', 'update_time', 'view_count', 'update_time')
    ordering = ('lang_code', 'notice_type', 'status', 'create_time')

    class Media:
        js = (
            '/static/js/kindeditor/kindeditor-all-min.js',
            '/static/js/kindeditor/lang/zh-CN.js',
            '/static/js/kindeditor/config.js'
        )

    def get_actions(self, request):
        return None

    def has_delete_permission(self, request, obj=None):
        return False


class MessageUserInline(admin.StackedInline):
    extra = 2
    model = MessageUser
    readonly_fields = ('is_deleted', 'is_read')
    can_delete = False
    verbose_name_plural = '选择用户'


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'create_time', 'type', 'is_all_users', 'lang_code')
    search_fields = ('id', 'title', 'content')
    list_filter = ('is_all_users', 'type', 'lang_code')
    fieldsets = (
        (None, {'fields': ('id', 'lang_code', 'type', 'title',)}),
        ('编辑正文', {'fields': ('content',)}),
        ('选择用户', {'fields': ('is_all_users',)})
    )
    readonly_fields = ('id', 'create_time')
    ordering = ('lang_code', '-is_all_users', 'type')
    inlines = (MessageUserInline,)

    class Media:
        js = (
            '/static/js/kindeditor/kindeditor-all-min.js',
            '/static/js/kindeditor/lang/zh-CN.js',
            '/static/js/kindeditor/message-config.js'
        )

    def get_actions(self, request):
        return None

    def has_delete_permission(self, request, obj=None):
        return False
