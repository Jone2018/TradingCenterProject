# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.http import JsonResponse, HttpResponse
import json
from django.core.serializers.json import DjangoJSONEncoder


def login_required(func):
    def wrap(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({'result':False, 'code': 10000, 'msg': '用户未登录'})
        return func(request, *args, **kwargs)
    wrap.__doc__=func.__doc__
    wrap.__name__=func.__name__
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