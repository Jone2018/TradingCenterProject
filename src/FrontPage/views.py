# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import logging

from django.http import (
    HttpResponse
)
from django.template.loader import select_template

logger = logging.getLogger(__name__)


def as_i18n_view(request, template_name):
    '''

    '''
    if hasattr(request, 'session'):
        lang_code = request.session.get('_language')
        if lang_code is None:
            lang_code = 'zh-hans'
    else:
        lang_code = 'zh-hans'

    i18n_template_name = template_name
    if lang_code != 'zh-hans':
        dirs = i18n_template_name.split('/')
        dirs.insert(len(dirs) - 1, lang_code)
        i18n_template_name = ''
        for d in dirs:
            i18n_template_name += '{}/'.format(d)
        i18n_template_name = i18n_template_name[0:-1]
    template = select_template([i18n_template_name, template_name])

    return HttpResponse(template.render({}, request))

# def redirect(request, path):
#     session = requests.session()
#     for key in request.COOKIES:
#         session.cookies[key] = request.COOKIES[key]
#     session.cookies['client_addr'] = request.META.get('REMOTE_ADDR', '127.0.0.1')
#
#     if request.method == 'GET':
#         response = session.get(path, params=dict(request.GET))
#     elif request.method == 'POST':
#         response = session.post(path, data=dict(request.POST))
#     else:
#         return HttpResponseBadRequest()
#
#     if response.ok:
#         r = HttpResponse(response.content, response.headers['Content-Type'])
#         if 'sessionid' in response.cookies:
#             r.set_cookie('sessionid', response.cookies['sessionid'])
#         return r
#
#     return HttpResponseNotFound()
#
#
# # @ratelimit(key='ip', rate='5/s')
# def redirect_social_login(request):
#     path = settings.ACCOUNT_API_URL + request.path
#
#     session = requests.session()
#     for key in request.COOKIES:
#         session.cookies[key] = request.COOKIES[key]
#     session.cookies['client_addr'] = request.META.get('REMOTE_ADDR', '127.0.0.1')
#
#     if request.method == 'GET':
#         response = session.get(path, allow_redirects=False)
#         if response.ok:
#             url = response.headers['location']  # 转接地址
#             r = JsonResponse({'url': url})
#             if 'sessionid' in response.cookies:
#                 r.set_cookie('sessionid', response.cookies['sessionid'])
#             return r
#             # url = url.replace(settings.ACCOUNT_API_URL, settings.SITE_URL)
#     return HttpResponseNotFound()
#
#
# # @ratelimit(key='ip', rate='5/s')
# def redirect_social_complete(request):
#     path = settings.ACCOUNT_API_URL + request.path
#
#     session = requests.session()
#     for key in request.COOKIES:
#         session.cookies[key] = request.COOKIES[key]
#     session.cookies['client_addr'] = request.META.get('REMOTE_ADDR', '127.0.0.1')
#
#     if request.method == 'GET':
#         response = session.get(path, params=dict(request.GET), allow_redirects=False)
#         if response.ok:
#             r = HttpResponseRedirect('/')
#             if 'sessionid' in response.cookies:
#                 r.set_cookie('sessionid', response.cookies['sessionid'])
#             return r
#
#     return HttpResponseNotFound()
#
#
# # @ratelimit(key='ip', rate='15/s', block=True)
# def redirect_account(request):
#     path = settings.ACCOUNT_API_URL + request.path
#     return redirect(request, path)
#
#
# # @ratelimit(key='ip', rate='15/s', block=True)
# def redirect_finance(request):
#     path = settings.FINANCE_API_URL + request.path
#     return redirect(request, path)
#
#
# # @ratelimit(key='ip', rate='15/s', block=True)
# def redirect_ico(request):
#     path = settings.ICO_API_URL + request.path
#     print(path)
#     return redirect(request, path)
#
#
# # @ratelimit(key='ip', rate='15/s', block=True)
# def redirect_order(request):
#     path = settings.ORDER_API_URL + request.path
#     return redirect(request, path)
#
#
# # @ratelimit(key='ip', rate='15/s', block=True)
# def redirect_transaction(request):
#     path = settings.TRANSACTION_API_URL + request.path
#     return redirect(request, path)
#
#
# # @ratelimit(key='ip', rate='15/s', block=True)
# def redirect_market(request):
#     path = settings.MARKET_API_URL + request.path
#     return redirect(request, path)
#
#
# # @ratelimit(key='ip', rate='15/s', block=True)
# def confirm_email(request, key):
#     return render(request, 'confirm_email.html', {'key': key})
#
#
# # @ratelimit(key='ip', rate='15/s', block=True)
# def redirect_service(request):
#     path = settings.SERVICE_API_URL + request.path
#     return redirect(request, path)
