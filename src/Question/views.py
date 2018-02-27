# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import logging

from django.http import JsonResponse
from django.views.decorators.http import require_POST, require_GET

from Dic.conf import DIC_QUESTION_TYPE, DIC_QUESTION_STATUS
from .decorators import login_required
from .models import Question
from .utils import xss_filter

logger = logging.getLogger(__name__)


# 生成工单
@require_POST
@login_required
def create_question(request):
    try:
        data = dict()
        data['question_type'] = int(request.POST['question_type'])

        # 工单类型校验
        if data['question_type'] not in DIC_QUESTION_TYPE.keys():
            return JsonResponse({'result': False, 'code': 10083, 'msg': '不支持的工单类型'})

        # 防止xss注入
        data['content'] = xss_filter(request.POST['content'])

        # 非空校验
        if data['content'].strip() == '':
            return JsonResponse({'result': False, 'code': 10084, 'msg': '问题描述不能为空'})

        data['user_id'] = request.user.pk
    except Exception as e:
        logger.debug(e)
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数格式错误'})

    try:
        Question.objects.create(**data)
        return JsonResponse({'result': True, 'data': {'status': 1}})
    except Exception as e:
        logger.error('创建工单失败，{}。'.format(e))
        return JsonResponse({'result': False, 'code': 10085, 'msg': '创建工单失败'})


# 获取工单列表
@require_GET
@login_required
def get_question_list(request):
    try:
        page = request.GET.get('page')
        limit = request.GET.get('limit')
        status = int(request.GET['status'])

        if page is not None:
            page = [int(page), 1][int(page) < 0]
        else:
            page = 1

        if limit is not None:
            limit = [int(limit), 10][int(limit) < 0]
        else:
            limit = 10

        if status not in (-1, 0, 1):
            raise Exception()
        data = list()
        begin = limit * (page - 1)
        end = begin + limit

        user = request.user
    except Exception as e:
        logger.debug(e)
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数格式错误'})

    try:
        if status == -1:
            questions = Question.objects.filter(user_id=user.id, is_deleted=False)[begin:end]
        else:
            questions = Question.objects.filter(user_id=user.id, is_deleted=False, status=status)[begin:end]
        for question in questions:
            data.append({
                'question_id': question.id,
                'question_code': question.question_code,
                'content': question.content,
                'question_type': DIC_QUESTION_TYPE[question.question_type],
                'create_time': question.create_time,
                'status': DIC_QUESTION_STATUS[question.status]
            }, )

        return JsonResponse({'result': True, 'data': data})
    except Exception as e:
        logger.error('获取工单列表失败，{}。'.format(e))
        return JsonResponse({'result': False, 'code': 10086, 'msg': '获取工单列表失败'})


# 获取工单详情
@login_required
@require_GET
def question_info(request):
    try:
        question_id = int(request.GET['question_id'])
        user = request.user
    except Exception as e:
        logger.debug(e)
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数格式错误'})

    try:
        data = dict()
        try:
            question = Question.objects.get(user_id=user.id, pk=question_id, is_deleted=False)
        except Question.DoesNotExist:
            raise Exception('找不到用户ID为{user_id}订单ID为{question_id}的工单信息'
                            .format({'user_id': user.id, 'question': question_id}))
        data['question'] = {
            'question_id': question.id,
            'question_code': question.question_code,
            'content': question.content,
            'question_type': DIC_QUESTION_TYPE[question.question_type],
            'create_time': question.create_time,
            'status': DIC_QUESTION_STATUS[question.status]
        }
        replies = question.replies.all()
        data['replies'] = list()

        for reply in replies:
            data['replies'].append({
                # TODO 客服编号需要进一步讨论，暂时返回固定值。
                'admin_code': '10012',
                'reply_content': reply.content,
                'reply_time': reply.create_time
            })

        return JsonResponse({'result': True, 'data': data})
    except Exception as e:
        logger.error('获取工单详情失败，{}。'.format(e))
        return JsonResponse({'result': False, 'code': 10087, 'msg': '获取工单详情失败'})


# 用户删除工单
@require_GET
@login_required
def question_delete(request):
    try:
        question_id = int(request.GET['question_id'])
        user = request.user
    except Exception as e:
        logger.debug(e)
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数格式错误'})
    try:
        question = Question.objects.get(user_id=user.id, pk=question_id, is_deleted=False)
        question.is_deleted = True
        question.save()
        return JsonResponse({'result': True, 'data': {'status': 1}})
    except Exception as e:
        logger.error('删除工单失败，{}'.format(e))
        return JsonResponse({'result': False, 'code': 10108, 'msg': '获取工单详情失败'})
