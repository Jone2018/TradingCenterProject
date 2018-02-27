# -*- coding: utf-8 -*-
import pickle
from django.conf import settings
from datetime import datetime
import time
from random import randint
from decimal import Decimal, ROUND_UP

DECIMAL_UP = lambda x: x.quantize(Decimal('0.00000001'), ROUND_UP)

''' 生成唯一的长度为20的编号

生成规则及编号组成：
年：4位10进制数
月：2位10进制数
日：2位10进制数
秒：取总秒数的后5位，一天之内不重复
微秒：取微秒数从第2位开始的5位数字
随机数：0-99的随机数2位

@return str 编号
@author tau <guantau@163.com>
'''


def unique_code():
    nowtm = time.time()
    nowstr = str(int(nowtm * 1e6))
    nowdate = datetime.fromtimestamp(nowtm)
    sn = '%d%02d%02d%s%s%02d' % (nowdate.year, nowdate.month, nowdate.day, nowstr[5:10], nowstr[11:16], randint(0, 99))
    return sn


def calc_fee(fee_type, price, quantity):
    fee = DECIMAL_UP(Decimal('0.002') * (Decimal(price) * Decimal(quantity)))
    return fee


def get_url(pair_id):
    url = settings.ORDERQUEUE_URL9000
    if pair_id == 1:
        url = settings.ORDERQUEUE_URL9000
    elif pair_id == 2:
        url = settings.ORDERQUEUE_URL9001
    elif pair_id == 4:
        url = settings.ORDERQUEUE_URL9002

    return url


def request2json(request):
    """
    uid = order.get('uid')
    pair_code = order.get('pair_code')
    price = order.get('price')
    quantity = order.get('quantity')
    direction = order.get('direction')
    action = order.get('action')
    auto_cancel = order.get('auto_cancel')
    trade_pwd = order.get('trade_pwd')
    has_valid_time = order.get('has_valid_time')
    valid_time = order.get('valid_time')
    """
    tmp = dict(
        uid=request.user.uid,

        pair_code=request.POST.get('pair_code'),
        price=request.POST.get('price'),
        quantity=request.POST.get('quantity'),
        direction=request.POST.get('direction'),
        action=request.POST.get('action'),
        auto_cancel=request.POST.get('auto_cancel'),
        trade_pwd=request.POST.get('trade_pwd'),
        has_valid_time=request.POST.get('has_valid_time'),
        valid_time=request.POST.get('valid_time'),
    )
    return pickle.dumps(tmp)


def build_topic(pair_id):
    return "%s_%s" % (settings.KAFKA_SETTINGS["topic_name"], pair_id)
