# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import logging
import time
import requests
import json
from decimal import Decimal
from collections import OrderedDict

from django.utils import timezone
from django.core.cache import cache
from django.db.models import Max, Min, Sum
from django.http import JsonResponse
from django.conf import settings
from Market.models import Transaction, MarketInfo

from Dic.models import PairChoices

# Create your views here.
from django.views.decorators.http import require_GET
from django.views.decorators.cache import cache_page
from Market.decorators import login_required
from django.core.cache import cache

logger = logging.getLogger(__name__)


@require_GET
def trade_list(request):
    """
     优先从缓存中取数据
     如果缓存中没有数据，则从表中查
    """
    try:
        pair_code = request.GET.get('pair_code', '10000')  # 交易对
        page_size = int(request.GET.get('page_size', '5'))  # 页面数量 5

        pair_record = PairChoices.objects.filter(code=int(pair_code))

        if not pair_record:
            return JsonResponse({'result': False, 'code': 10076, 'msg': '该交易对不存在'})

        pair_id = pair_record.first().pk

        cache_key = 'TRADE_LIST_%s' % pair_code

        cached_data = cache.get(cache_key)
        if cached_data:
            bid_sorted = cached_data.get('bid')
            asks_sorted = cached_data.get('asks')
            _trade_list = cached_data.get('trade_list')
        else:
            # 买单 价格从高到低排序
            bid_all = MarketInfo.objects.filter(direction=0, is_new=1, pair_id=pair_id)
            # 卖单 价格从低到高排序
            asks_all = MarketInfo.objects.filter(direction=1, is_new=1, pair_id=pair_id)

            bid_sorted = sorted(bid_all, cmp=lambda a, b: cmp(float(b.price), float(a.price)))[:page_size]
            asks_sorted = sorted(asks_all, cmp=lambda b, a: cmp(float(b.price), float(a.price)))[:page_size]

            asks_sorted.reverse()

            _trade_list = Transaction.objects.filter(pair_id=pair_id).order_by('-create_time')[:20]

            cache.set(cache_key, {'bid': bid_sorted, 'asks': asks_sorted, 'trade_list': _trade_list}, 2)

        sell_or_buy = lambda t: "sell" if t else "buy"

        def _get_local_time(t):
            current_tz = timezone.get_current_timezone()
            local_time = current_tz.normalize(t)
            return local_time.strftime('%m-%d %H:%M:%S')

        def _format_float(num):
            if num >= 100:
                return '%.1f' % num
            if 10 <= num < 100:
                return '%.2f' % num
            if 0.001 < num < 10:
                return '%.3f' % num
            if num <= 0.001:
                return num

        context = {
            "result": True,
            "data": {
                "bid": [[float(b.price), _format_float(b.quantity)] for b in bid_sorted],
                "asks": [[float(a.price), _format_float(a.quantity)] for a in asks_sorted],
                "trade_list": [
                    [_get_local_time(o.create_time), o.quantity, float(o.price), sell_or_buy(o.direction)]
                    for o in _trade_list
                ],
                "update_time": int(time.time()),
            }
        }

        return JsonResponse(context)
    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数格式错误'})


@require_GET
@cache_page(15)
def market_info(request):
    """
    ID越大，订单越新
    2017.11.10  涨跌幅由当日零点更改为当前时间向前推24小时
    7日同
    """

    def get_previous_hours(hours):
        # assert isinctance(hours, (int, float)) "时间必须是一个int/float"
        now = timezone.now()
        target = now - timezone.timedelta(hours=hours)
        return target

    all_pair_code_qs = PairChoices.objects.filter(is_allow_trade=True).values('code', 'pk').order_by('-code')

    all_pair_code_dic = OrderedDict()

    for pc in all_pair_code_qs:
        all_pair_code_dic[pc['pk']] = pc['code']

    allow_display_pair_ids = all_pair_code_dic.keys()  # [3]

    # 获取最新BTC/CNY汇率 设置超时时间为2s,添加缓存支持
    try:
        cny_rate = cache.get('cny_rate')
        if not cny_rate:
            cny_rate = json.loads(requests.get(settings.CNYRATE_URL, timeout=2).text)['rate']
            btc_rate = json.loads(requests.get(settings.BTCRATE_URL, timeout=2).text)['future_index']
            cny_rate = int(round(cny_rate*btc_rate/100)*100)
            cache.set('cny_rate', cny_rate, 60 * 30)
    except Exception as e:
        logger.error('从api获取最新BTC/CNY汇率失败，{}'.format(e))
        cny_rate = None


    try:
        # 为每一种币 -- 取最新一条交易数据
        # SELECT MAX(`id`) AS pk, `pair_id` FROM `Market_transaction` WHERE create_time >= {} GROUP BY `pair_id`;
        latest_orders = Transaction.objects.filter(create_time__gte=get_previous_hours(24), pair_id__in=allow_display_pair_ids).values('pair_id').annotate(
            pk=Max('id')).order_by()
        target_orders = Transaction.objects.filter(pk__in=[no['pk'] for no in latest_orders])

        # 为每一种币 -- 取24小时内的第一条交易数据
        # SELECT id, price, MIN(create_time) AS first_order_time, pair_id FROM Market_transaction WHERE create_time >= %s GROUP BY pair_id' ORDER BY create_time
        first = Transaction.objects.filter(create_time__gte=get_previous_hours(24), pair_id__in=allow_display_pair_ids).values('pair_id').annotate(
            pk=Min('id')).order_by()
        first_orders = Transaction.objects.filter(pk__in=[no['pk'] for no in first])

        # 为每一种币 -- 取7日内的第一条交易数据
        # SELECT `Market_transaction`.`pair_id`, MIN(`Market_transaction`.`id`) AS `pk` FROM `Market_transaction` WHERE `Market_transaction`.`create_time` >= '2017-10-17 00:00:00' GROUP BY `Market_transaction`.`pair_id` ORDER BY NULL;
        first_order_ids_last_7_days = Transaction.objects.filter(create_time__gte=get_previous_hours(7 * 24), pair_id__in=allow_display_pair_ids).values('pair_id').annotate(pk=Min('id')).order_by()
        first_orders_last_7_days = Transaction.objects.filter(pk__in=[no['pk'] for no in first_order_ids_last_7_days])

        # 24小时成交量
        all_orders_today = Transaction.objects.filter(create_time__gte=get_previous_hours(24), pair_id__in=allow_display_pair_ids).values('pair_id').annotate(
            vol=Sum('quantity')).order_by()

        vol_dict = {
            v['pair_id']: v['vol']
            for v in all_orders_today
        }

        # 取昨日最后一条记录，涨跌幅为0
        previous_48_hours = get_previous_hours(48)
        previous_48_latest = Transaction.objects.filter(create_time__gte=previous_48_hours, pair_id__in=allow_display_pair_ids).values('pair_id').annotate(
            pk=Max('id')).order_by()
        previous_48_hours_orders = Transaction.objects.filter(pk__in=[no['pk'] for no in previous_48_latest])

        previous_48_hours_tmp = {
            all_pair_code_dic[tmp.pair_id]: tmp.price
            for tmp in previous_48_hours_orders
        }

        tmp = {
            tmp.pair_id: tmp.price
            for tmp in first_orders
        }

        tmp_7_days = {
            tmp.pair_id: tmp.price
            for tmp in first_orders_last_7_days
        }

        if target_orders:  # 今日有成交记录

            tmp_dic = {}

            for order in target_orders:
                tmp_dic[all_pair_code_dic[order.pair_id]] = {
                    "price": float(order.price),
                    "change_24h": (float(order.price) - float(tmp[order.pair_id])) / float(tmp[order.pair_id]),  # 24小时涨跌幅
                    "change_7d": (float(order.price) - float(tmp_7_days[order.pair_id])) / float(tmp_7_days[order.pair_id]),  # 7日涨跌幅
                    "vol": vol_dict.get(order.pair_id),
                    "updatetime": order.update_time.strftime('%Y-%m-%d %I:%M:%S')
                }

            context = []

            for p_c in all_pair_code_dic.values():
                if tmp_dic.get(p_c):
                    context.append({
                        "pair_code": p_c,
                        "price": tmp_dic.get(p_c).get('price'),
                        "cny_rate": cny_rate,
                        "change_24h": tmp_dic.get(p_c).get('change_24h'),  # 24小时涨跌幅
                        "vol": tmp_dic.get(p_c).get('vol'),
                        "change_7d": tmp_dic.get(p_c).get('change_7d'),
                        "updatetime": tmp_dic.get(p_c).get('updatetime'),
                    })
                else:
                    context.append({
                        "pair_code": p_c,
                        "price": previous_48_hours_tmp.get(p_c, '--'),
                        "cny_rate": cny_rate,
                        "change_24h": '0',  # 24小时涨跌幅
                        "change_7d": '0',
                        "vol": 0,
                        "updatetime": '--'
                    })
        else:  # 今日无成交记录
            context = [
                {
                    "pair_code": o,
                    "price": previous_48_hours_tmp.get(o, '--'),
                    "cny_rate": cny_rate,
                    "change_24h": '0',  # 24小时涨跌幅
                    "change_7d": '0',
                    "vol": 0,
                    "updatetime": '--'
                }
                for o in all_pair_code_dic.values()
            ]

        return JsonResponse({
            'result': True,
            'data': context
        })
    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数格式错误'})


# 获取最新BTC/CNY汇率 设置超时时间为2s
@require_GET
def get_cny_rate(request):
    try:
        cny_rate = cache.get('cny_rate')
        if cny_rate:
            return JsonResponse({
                'result': True,
                'data': {
                    'cny_rate': cny_rate,
                    'updatetime': timezone.now()
                }
            })
        cny_rate = json.loads(requests.get(settings.CNYRATE_URL, timeout=2).text)['rate']
        btc_rate = json.loads(requests.get(settings.BTCRATE_URL, timeout=2).text)['future_index']
        cny_rate = int(round(cny_rate*btc_rate/100)*100)
        cache.set('cny_rate',cny_rate,60*30)
        return JsonResponse({
            'result': True,
            'data': {
                'cny_rate': cny_rate,
                'updatetime': timezone.now()
            }
        })
    except Exception as e:
        logger.error('从api获取最新BTC/CNY汇率失败，{}'.format(e))
        return JsonResponse({'result': False, 'code': 10091, 'msg': '获取BTC/CNY汇率失败'})

@require_GET
def kline(request):
    try:
        return JsonResponse({
            "data": [[1498212000000, 49.603418, 19714, 19800, 19600, 19760.2],
                     [1498215600000, 57.0042, 19760.2, 19794, 19600, 19765],
                     [1498219200000, 89.061222, 19765, 19792.8, 19632.5, 19786.8],
                     [1498222800000, 103.868282, 19785.8, 19838, 19650.1, 19812.3],
                     [1498226400000, 85.93923, 19712.3, 19812, 19711.8, 19760],
                     [1498230000000, 75.550349, 19735, 19855, 19653, 19788],
                     [1498233600000, 53.693329, 19788, 19827.8, 19669, 19702.2],
                     [1498237200000, 28.221496, 19703.2, 19789, 19653, 19673.2],
                     [1498240800000, 17.67234, 19673.5, 19787.8, 19670, 19670],
                     [1498244400000, 29.712638, 19670.2, 19869.9, 19670, 19685.4],
                     [1498248000000, 25.23116, 19685.2, 19846.7, 19650, 19703.1],
                     [1498251600000, 17.202371, 19799, 19839.4, 19705.1, 19736],
                     [1498255200000, 23.514352, 19830, 19830, 19650.1, 19701],
                     [1498258800000, 74.176266, 19650.1, 19840, 19618, 19665],
                     [1498262400000, 89.562027, 19665, 19745, 19430, 19430],
                     [1498266000000, 116.526918, 19450, 19700, 19400, 19582],
                     [1498269600000, 95.558884, 19582, 19788, 19580.1, 19601],
                     [1498273200000, 59.695258, 19601, 19734.5, 19550, 19620],
                     [1498276800000, 54.582378, 19620, 19688.8, 19403, 19500],
                     [1498280400000, 48.497233, 19460, 19599, 19410, 19529],
                     [1498284000000, 91.67495, 19529, 19700.5, 19481.3, 19650],
                     [1498287600000, 99.056341, 19506.1, 19780.1, 19506.1, 19582.1],
                     [1498291200000, 63.960757, 19600, 19800, 19512.8, 19713.9],
                     [1498294800000, 58.023106, 19713.9, 19799, 19651.2, 19651.2],
                     [1498298400000, 55.873328, 19792.8, 19800, 19666, 19798],
                     [1498302000000, 58.581358, 19731, 19818, 19702, 19808],
                     [1498305600000, 54.820062, 19808, 19887.9, 19771.6, 19887],
                     [1498309200000, 130.684971, 19887, 19899, 19321, 19321],
                     [1498312800000, 121.846445, 19321, 19590, 19230, 19402.1],
                     [1498316400000, 60.499394, 19402.3, 19600, 19402.1, 19600],
                     [1498320000000, 0.162, 19599.8, 19599.8, 19599.8, 19599.8],
                     [1498341600000, 48.577854, 19545, 19545, 19389.7, 19495],
                     [1498366800000, 15.145286, 19300, 19300, 19100, 19135],
                     [1498370400000, 121.389015, 19300, 19494.9, 19135, 19400],
                     [1498374000000, 129.684563, 19320.1, 19555, 19320.1, 19383],
                     [1498377600000, 89.230416, 19383, 19490, 19200.1, 19230.8],
                     [1498381200000, 28.403574, 19255, 19493.8, 19254, 19401],
                     [1498384800000, 52.673093, 19402, 19502.9, 19333.1, 19500],
                     [1498388400000, 61.402713, 19499, 19700, 19406.1, 19607.2],
                     [1498392000000, 74.011362, 19688, 19800, 19562.1, 19700],
                     [1498395600000, 77.057717, 19700, 19725, 19568, 19690],
                     [1498399200000, 72.903413, 19717, 19756, 19617.9, 19680],
                     [1498402800000, 44.980135, 19680, 19710, 19603, 19635],
                     [1498406400000, 46.669013, 19649, 19789, 19616.1, 19789],
                     [1498410000000, 25.551757, 19789, 19800, 19640.1, 19700],
                     [1498413600000, 32.795707, 19700, 19700.2, 19603, 19615],
                     [1498417200000, 18.136235, 19698, 19700, 19519, 19619],
                     [1498420800000, 13.300047, 19619, 19745, 19519.2, 19745],
                     [1498424400000, 57.269246, 19744, 19801, 19531.1, 19700],
                     [1498428000000, 80.909693, 19699, 19755, 19400.1, 19599],
                     [1498431600000, 78.342017, 19599, 19820, 19408.2, 19730],
                     [1498435200000, 58.621371, 19798.6, 19820, 19407, 19520.8],
                     [1498438800000, 53.208611, 19410.1, 19600, 19381, 19520],
                     [1498442400000, 55.671336, 19560, 19576, 19416.5, 19455.2],
                     [1498446000000, 56.16075, 19549.8, 19600, 19455.2, 19600],
                     [1498449600000, 23.751036, 19600, 19684, 19593, 19600],
                     [1498453200000, 76.461635, 19595, 19677, 19400, 19500.2],
                     [1498456800000, 104.849886, 19512, 19667, 19100, 19106.2],
                     [1498460400000, 164.516303, 19106, 19471.2, 19100, 19320],
                     [1498464000000, 106.661162, 19388, 19399, 19011, 19061],
                     [1498467600000, 114.187515, 19061, 19250, 18955, 19176.9],
                     [1498471200000, 66.88632, 19247.7, 19350, 19051.3, 19052.2],
                     [1498474800000, 108.321334, 19051.3, 19058.9, 18600.2, 18760],
                     [1498478400000, 93.76765, 18760.1, 18891, 18300.6, 18730],
                     [1498482000000, 65.8803, 18730, 18888, 18620, 18660.1],
                     [1498485600000, 52.560363, 18660.1, 18769.9, 18307.2, 18323],
                     [1498489200000, 213.56828, 18447.8, 18447.8, 17600.8, 17936],
                     [1498492800000, 96.825283, 17950, 18332, 17857.3, 18332],
                     [1498496400000, 64.677758, 18330, 18330, 18004, 18254.7],
                     [1498500000000, 55.940532, 18228, 18422, 18100.4, 18253.7],
                     [1498503600000, 21.664862, 18221.6, 18398.9, 18051, 18060.1],
                     [1498507200000, 20.750304, 18060.1, 18435, 18060.1, 18435],
                     [1498510800000, 21.359846, 18435, 18698.2, 18236.8, 18698.2],
                     [1498514400000, 24.686231, 18687.3, 18765, 18550.3, 18727],
                     [1498518000000, 53.312039, 18727.9, 18765, 18299, 18299],
                     [1498521600000, 96.374886, 18231, 18500, 18000, 18420],
                     [1498525200000, 62.404279, 18380, 18675, 18285, 18600.1],
                     [1498528800000, 42.423389, 18600, 18760, 18600, 18748],
                     [1498532400000, 40.636212, 18700, 18800, 18679, 18679],
                     [1498536000000, 42.612418, 18677, 18749, 18500, 18501],
                     [1498539600000, 31.720879, 18600.8, 18669, 18500, 18505],
                     [1498543200000, 82.360294, 18505, 18610.9, 18389, 18400],
                     [1498546800000, 102.109632, 18389, 18399.8, 17989, 18149.8],
                     [1498550400000, 73.188507, 18062, 18145.9, 17800.6, 18014.8],
                     [1498554000000, 39.860976, 18015, 18249.9, 17931, 18150],
                     [1498557600000, 33.454958, 18050.2, 18150, 17974.6, 17974.7],
                     [1498561200000, 62.320481, 17974.7, 18073, 17562, 17578],
                     [1498564800000, 80.121075, 17562, 17676, 17150, 17502],
                     [1498568400000, 111.483915, 17560, 17560, 16800, 16920.2],
                     [1498572000000, 99.226602, 16920.2, 17300, 16760, 17200],
                     [1498575600000, 54.459879, 17200, 17380, 17100, 17380]]
        }
        )
    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数格式错误'})

