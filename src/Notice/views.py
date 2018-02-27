# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import logging

from django.db.models import Q
from django.db.transaction import atomic
from django.http import JsonResponse
from django.views.decorators.http import require_GET

from Dic.conf import DIC_NOTICE_TYPE, DIC_MESSAGE_TYPE
from .conf import MESSAGE_INTERFACE_TYPE
from .decorators import login_required
from .models import Notice, Message, MessageUser

logger = logging.getLogger(__name__)


# 获取公告列表
@require_GET
def get_notice_list(request):
    try:
        # 从session中获取当前用户语言代码
        if hasattr(request, 'session'):
            lang_code = request.session.get('_language')
            if lang_code is None:
                lang_code = 'zh-hans'
        else:
            lang_code = 'zh-hans'

        notice_type = request.GET.get('notice_type')
        size = request.GET.get('size')
        important = request.GET.get('important')

        if size is not None:
            size = int(size)
            if size < 1:
                raise Exception()

        if notice_type is not None:
            notice_type = int(notice_type)
            if notice_type not in DIC_NOTICE_TYPE:
                raise Exception()

        if important is not None:
            important = int(important)

    except Exception as e:
        logger.debug(e)
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数格式错误'})
    try:
        data = list()
        query_set = Notice.objects.filter(status=1)

        # 只获取当前语种记录
        query_set = query_set.filter(lang_code=lang_code)

        if notice_type is not None:
            query_set = query_set.filter(notice_type=notice_type)
        if important is not None:
            if important:
                query_set = query_set.filter(is_important=True)
            else:
                query_set = query_set.filter(is_important=False)
        query_set = query_set.order_by("-create_time")
        if size is not None:
            query_set = query_set[0:size]

        notices = query_set

        for notice in notices:
            data.append({
                'notice_id': notice.id,
                'title': notice.title,
                'author': notice.author,
                'important': notice.is_important,
                'valid': notice.is_valid,
                'img': notice.title_img,
                'banner': notice.banner_img,
                'create_time': notice.create_time
            })

        return JsonResponse({'result': True, 'data': data})
    except Exception as e:
        logger.error('获取公告列表出错，{}。'.format(e))
        return JsonResponse({'result': False, 'code': 10088, 'msg': '获取公告列表失败'})


# 获取公告详情
@require_GET
def get_notice(request):
    try:
        notice_id = int(request.GET['notice_id'])
    except Exception as e:
        logger.debug(e)
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数格式错误'})

    try:
        try:
            notice = Notice.objects.get(pk=notice_id, status=1)
            notice.view_count += 1
            notice.save()
        except Notice.DoesNotExist:
            raise Exception('找不到公告ID为{}状态为已激活的公告信息'.format(notice_id))
        data = {
            'notice_id': notice.id,
            'title': notice.title,
            'content': notice.content,
            'author': notice.author,
            'important': notice.is_important,
            'valid': notice.is_valid,
            'img': notice.title_img,
            'view_count': notice.view_count,
            'create_time': notice.create_time
        }
        return JsonResponse({'result': True, 'data': data})
    except Exception as e:
        logger.error('获取公告详情失败，{}。'.format(e))
        return JsonResponse({'result': False, 'code': 10089, 'msg': '获取公告详情失败'})


# 获取未读条数
@login_required
def get_message_count(request):
    try:
        # 从session中获取当前用户语言代码
        if hasattr(request, 'session'):
            lang_code = request.session.get('_language')
            if lang_code is None:
                lang_code = 'zh-hans'
        else:
            lang_code = 'zh-hans'

        lang_query_set = Message.objects.filter(lang_code=lang_code)

        count = 0
        messages = lang_query_set.filter(is_all_users=True)

        for message in messages:
            (message_user, is_created) = MessageUser.objects.get_or_create(
                message_id=message.id, user_id=request.user.id
            )
            if not message_user.is_deleted and not message_user.is_read:
                count += 1

        count += lang_query_set.filter(is_all_users=False).filter(
            Q(users__user_id=request.user.id)
        ).count()
        return JsonResponse({'result': True, 'data': {'count': count, }})
    except Exception as e:
        logger.error('获取未读消息个数失败，{}'.format(e))
        return JsonResponse({'result': False, 'code': 10091, 'msg': '获取未读消息个数失败'})


# 获取全部消息列表
@login_required
@require_GET
def get_all_messages(request):
    return JsonResponse(get_messages(request, type=MESSAGE_INTERFACE_TYPE.ALL))


# 获取未读消息列表
@require_GET
@login_required
def get_notRead_messages(request):
    return JsonResponse(get_messages(request, type=MESSAGE_INTERFACE_TYPE.NOTREAD))


# 获取已读消息列表
@require_GET
@login_required
def get_isRead_messages(request):
    return JsonResponse(get_messages(request, type=MESSAGE_INTERFACE_TYPE.ISREAD))


# 获取消息列表通用方法
def get_messages(request, type):
    '''

    :param request:
    :param type: 请求接口的类型，ALL:获取所有，ISREAD:获取未读，NOTREAD:获取已读
    :return:
    '''
    try:
        # 从session中获取当前用户语言代码
        if hasattr(request, 'session'):
            lang_code = request.session.get('_language')
            if lang_code is None:
                lang_code = 'zh-hans'
        else:
            lang_code = 'zh-hans'

        page = request.GET.get('page')
        limit = request.GET.get('limit')

        if page is not None:
            page = [int(page), 1][int(page) < 0]
        else:
            page = 1

        if limit is not None:
            limit = [int(limit), 10][int(limit) < 0]
        else:
            limit = 10

        begin = limit * (page - 1)
        end = begin + limit

        user = request.user
    except Exception as e:
        logger.debug(e)
        return {'result': False, 'code': 10001, 'msg': '请求参数格式错误'}

    try:
        lang_query_set = Message.objects.filter(lang_code=lang_code)

        messages = lang_query_set.filter(is_all_users=True)

        for message in messages:
            MessageUser.objects.get_or_create(message_id=message.id, user_id=user.id)

        messages = list()

        if type == MESSAGE_INTERFACE_TYPE.ALL:
            messages = lang_query_set.filter(
                users__user_id=user.id,
                users__is_deleted=False
            ).order_by("-create_time")[begin:end]

        if type == MESSAGE_INTERFACE_TYPE.NOTREAD:
            messages = lang_query_set.filter(
                users__user_id=user.id,
                users__is_deleted=False,
                users__is_read=False
            ).order_by("-create_time")[begin:end]

        if type == MESSAGE_INTERFACE_TYPE.ISREAD:
            messages = lang_query_set.filter(
                users__user_id=user.id,
                users__is_deleted=False,
                users__is_read=True
            ).order_by("-create_time")[begin:end]

        data = list()

        for message in messages:
            message_user = MessageUser.objects.get(message_id=message.id, user_id=user.id)
            data.append(
                {
                    'message_id': message.pk,
                    'message_title': message.title,
                    'message_content': message.content,
                    'message_createTime': message.create_time,
                    'message_isRead': message_user.is_read,
                    'message_type': DIC_MESSAGE_TYPE[message.type]
                }
            )

        return {'result': True, 'data': data}
    except Exception as e:
        logger.error('获取消息列表失败，{}'.format(e))
        return {'result': False, 'code': 10092, 'msg': '获取消息列表失败'}


# 获取消息详情(自动标注为已读)
@require_GET
@login_required
def message_info(request):
    try:
        message_id = int(request.GET['message_id'])
        user = request.user
    except Exception as e:
        logger.debug(e)
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数格式错误'})

    try:
        messages = Message.objects.filter(is_all_users=True)

        for message in messages:
            MessageUser.objects.get_or_create(message_id=message.id, user_id=user.id)

        message = Message.objects.get(
            pk=message_id,
            users__user_id=request.user.id,
            users__is_deleted=False,
        )

        message_user = MessageUser.objects.get(message_id=message.id, user_id=user.id)
        if not message_user.is_read:
            message_user.is_read = True
            message_user.save()

        data = {
            'message_id': message.pk,
            'message_title': message.title,
            'message_content': message.content,
            'message_createTime': message.create_time,
            'message_isRead': message_user.is_read,
            'message_type': DIC_MESSAGE_TYPE[message.type]
        }

        return JsonResponse({'result': True, 'data': data})
    except Exception as e:
        logger.error('获取消息详情失败，{}'.format(e))
        return JsonResponse({'result': False, 'code': 10093, 'msg': '获取消息详情失败'})


# 批量删除消息
@login_required
@require_GET
def delete_messages(request):
    try:
        ids = request.GET.getlist('message_id')

        if len(ids) == 0:
            raise Exception('message_id不能为空')

        ids = [int(id) for id in ids]
        ids = list(set(ids))
        user = request.user
    except Exception as e:
        logger.debug(e)
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数格式错误'})

    try:
        with atomic(using='service_db'):
            for id in ids:
                (message_user, is_created) = MessageUser.objects.get_or_create(message_id=id, user_id=user.id)
                if not message_user.is_deleted:
                    message_user.is_deleted = True
                    message_user.save()

        return JsonResponse({'result': True, 'data': {}})
    except Exception as e:
        logger.error('获取消息详情失败，{}'.format(e))
        return JsonResponse({'result': False, 'code': 10094, 'msg': '删除消息失败'})


# 批量标记消息为已读
@login_required
@require_GET
def isRead_messages(request):
    try:
        ids = request.GET.getlist('message_id')

        if len(ids) == 0:
            raise Exception('message_id不能为空')

        ids = [int(id) for id in ids]
        ids = list(set(ids))
        user = request.user
    except Exception as e:
        logger.debug(e)
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数格式错误'})

    try:
        with atomic(using='service_db'):
            for id in ids:
                (message_user, is_created) = MessageUser.objects.get_or_create(message_id=id, user_id=user.id)
                if not message_user.is_deleted and not message_user.is_read:
                    message_user.is_read = True
                    message_user.save()

        return JsonResponse({'result': True, 'data': {}})
    except Exception as e:
        logger.error('获取消息详情失败，{}'.format(e))
        return JsonResponse({'result': False, 'code': 10094, 'msg': '标记消息为已读失败'})
