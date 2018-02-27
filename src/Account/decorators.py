# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json

from django.core.serializers.json import DjangoJSONEncoder
from django.http import JsonResponse, HttpResponse

from .models import Realname


def login_required(func):
    def wrap(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({'result': False, 'code': 10000, 'msg': '用户未登录'})
        return func(request, *args, **kwargs)

    wrap.__doc__ = func.__doc__
    wrap.__name__ = func.__name__
    return wrap


def realname_required(func):
    def wrap(request, *args, **kwargs):
        try:
            realname = Realname.objects.get(user=request.user)
            if realname.info_status != 1 \
                    or realname.pic_status != 1 \
                    or not request.user.is_authenticated:
                return JsonResponse({'result': False, 'code': 10111, 'msg': '用户未实名认证'})
            return func(request, *args, **kwargs)
        except Realname.DoesNotExist:
            return JsonResponse({'result': False, 'code': 10111, 'msg': '用户未实名认证'})

    wrap.__doc__ = func.__doc__
    wrap.__name__ = func.__name__
    return wrap


def json_response(func):
    """
    A decorator thats takes a view response and turns it
    into json. If a callback is added through GET or POST
    the response is JSONP.
    """

    def decorator(request, *args, **kwargs):
        objects = func(request, *args, **kwargs)
        if isinstance(objects, HttpResponse):
            return objects
        try:
            data = json.dumps(objects, cls=DjangoJSONEncoder)
            if 'callback' in request.GET:
                # a jsonp response!
                data = '%s(%s);' % (request.GET['callback'], data)
                return HttpResponse(data, 'text/javascript')
        except Exception as e:
            data = objects
        return HttpResponse(data, 'application/json')

    return decorator


'''
使用在线API测试工具
'''


def csrf_response(func):
    def decorator(request, *args, **kargs):
        objects = func(request, *args, **kargs)
        objects['Access-Control-Allow-Origin'] = 'http://runapi.showdoc.cc'
        objects['Access-Control-Allow-Credentials'] = 'true'
        return objects

    return decorator
