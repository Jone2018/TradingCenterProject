# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import logging
import time

from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView

from .utils import get_pair_id
from ..models import MarketInfo, Transaction

LOGGER = logging.getLogger(__name__)


class Ticker(APIView):
    """
    获取行情API
    ULOGOS      https://www.chaobi.la/api/v1/ticker?symbol=ulogos_btc
    BITCOINLOGO https://www.chaobi.la/api/v1/ticker?symbol=bitcoinlogo_btc

    参数：
    symbol String 否(默认ulogos_btc)  ulogos_btc: ULOGOS   bitcoinlogo_btc: BITCOINLOGO

    返回值：
    date: 返回数据时服务器时间
    buy: 买一价
    high: 最高价
    last: 最新成交价
    low: 最低价
    sell: 卖一价
    vol: 成交量(最近的24小时)
    """
    @staticmethod
    def get_midnight():
        now = timezone.now()
        midnight = now - timezone.timedelta(hours=now.hour, minutes=now.minute, seconds=now.second,
                                            microseconds=now.microsecond)
        return midnight

    def get(self, request, format=None):
        try:
            symbol = request.GET.get('symbol', 'ulogos_btc')
            pair_id = get_pair_id(symbol)
        except:
            return Response({'result': False, 'msg': '该交易对不存在'})

        # 买一
        obj = MarketInfo.objects.values('price').filter(pair_id=pair_id, direction=0, is_new=1).first()
        if obj:
            buy = float(obj['price'])
        else:
            buy = 0

        # 卖一
        obj = MarketInfo.objects.values('price').filter(pair_id=pair_id, direction=1, is_new=1).first()
        if obj:
            sell = float(obj['price'])
        else:
            sell = 0

        # 最新成交价
        obj = Transaction.objects.values('price').filter(pair_id=pair_id).last()
        if obj:
            last = float(obj['price'])
        else:
            last = 0

        # 24小时成交记录
        txs = Transaction.objects.values_list('price', 'quantity').filter(pair_id=pair_id,
                                                                          create_time__gte=self.get_midnight())

        if txs:
            price = sorted([float(tx[0]) for tx in txs])  # 价格排序
            high = price[-1]  # 最高价
            low = price[0]    # 最低价
            vol = sum([float(tx[1]) for tx in txs]) # 成交量
        else:
            high = last
            low = last
            vol = 0

        return Response({
            'date': str(int(time.time())),
            'ticker': {
                'buy': buy,
                'high': high,
                'last': last,
                'sell': sell,
                'low': low,
                'vol': vol
            }
        })


class Depth(APIView):
    """
    获取深度API
    ULOGOS      https://www.chaobi.la/api/v1/depth?symbol=ulogos_btc
    BITCOINLOGO https://www.chaobi.la/api/v1/depth?symbol=bitcoinlogo_btc

    参数：
    symbol String  否(默认ulogos_btc)  ulogos_btc: ULOGOS   bitcoinlogo_btc: BITCOINLOGO
    size   Integer 否(默认30)          value: 1-30

    返回值：
    asks :卖方深度
    bids :买方深度
    """

    # todo 请求参数名
    def get(self, request, format=None):
        try:
            symbol = request.GET.get('symbol', 'ulogos_btc')
            pair_id = get_pair_id(symbol)
        except:
            return Response({'result': False, 'msg': '该交易对不存在'})

        page_size = int(request.GET.get('size', '30'))  # 页面数量 30

        # 买单 价格从高到低排序
        bid_all = MarketInfo.objects.values_list('price', 'quantity').filter(pair_id=pair_id,
                                                                             direction=0, is_new=1)[:page_size]
        resp_bids = [(float(a[0]), float(a[1])) for a in bid_all]

        # 卖单 价格从低到高排序
        asks_all = MarketInfo.objects.values_list('price', 'quantity').filter(pair_id=pair_id,
                                                                              direction=1, is_new=1)[:page_size]
        resp_asks = [(float(a[0]), float(a[1])) for a in asks_all]

        return Response({
            'asks': resp_asks,
            'bids': resp_bids
        })


class Trades(APIView):
    """
    获取交易信息API(600条)
    ULOGOS      https://www.chaobi.la/api/v1/trades?symbol=ulogos_btc
    BITCOINLOGO https://www.chaobi.la/api/v1/trades?symbol=bitcoinlogo_btc

    参数：
    symbol String  否(默认ulogos_btc)        ulogos_btc: ULOGOS   bitcoinlogo_btc: BITCOINLOGO
    since  Long    否(默认返回最近成交600条)  tid:交易记录ID（返回数据不包括当前tid值,最多返回600条数据）

    返回值：
    date:交易时间
    date_ms:交易时间(ms)
    price: 交易价格
    amount: 交易数量
    tid: 交易生成ID
    type: buy/sell
    """

    # todo 请求参数名

    @staticmethod
    def _get_local_time(t, ms=False):
        current_tz = timezone.get_current_timezone()
        local_time = current_tz.normalize(t)
        return str(int(time.mktime(t.timetuple()) * 1000)) if ms else local_time.strftime('%s')

    def get(self, request, format=None):
        try:
            symbol = request.GET.get('symbol', 'ulogos_btc')
            pair_id = get_pair_id(symbol)
        except:
            return Response({'result': False, 'msg': '该交易对不存在'})

        since = int(request.GET.get('since', '1'))
        page_size = 600

        _trade_list = Transaction.objects.filter(pair_id=pair_id, id__gt=since).order_by('-create_time')[:page_size]

        sell_or_buy = lambda t: "sell" if t else "buy"

        trade_list = [
            {
                'date': self._get_local_time(o.create_time),
                'date_ms': self._get_local_time(o.create_time, True),
                'price': float(o.price),
                'amount': o.quantity,
                'tid': o.id,
                'type': sell_or_buy(o.direction)
            }
            for o in _trade_list
        ]

        return Response(trade_list)
