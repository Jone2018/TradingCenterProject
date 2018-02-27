# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import requests
from django.views.decorators.http import require_GET, require_POST
from django.utils import timezone
from django.http import JsonResponse
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.hashers import check_password

from datetime import datetime
from decimal import Decimal, ROUND_UP, ROUND_DOWN

import logging

from .models import Order, CancelOrder, create_cancelorder
from .decorators import login_required
from .serializers import CancelOrderSerializer
from .utils import calc_fee, get_url, build_topic
from .producer import produce_order

from Finance.models import Balances
from Dic.models import PairChoices, ActionChoices
from Dic.conf import DIC_TRADE_ORDER_STATUS, DIC_TRADE_ORDER_DIRECTION
from Market.models import Transaction
from collections import defaultdict

logger = logging.getLogger(__name__)


DECIMAL_DOWN = lambda x: x.quantize(Decimal('0.00000001'), ROUND_DOWN)
DECIMAL_UP = lambda x: x.quantize(Decimal('0.00000001'), ROUND_UP)


# Create your views here.
@login_required
@require_GET
def trade_pwd_status(request):
    if 'first_order' in request.session:
        return JsonResponse({'result': True, 'data': {'status': 2}})
    else:
        return JsonResponse({'result': True, 'data': {'status': 1}})


@login_required
@require_POST
def put_order(request):
    try:
        user = request.user

        # 交易对
        pair_code = int(request.POST['pair_code'])
        try:
            pair = PairChoices.objects.get(code=pair_code)
            pair_id = pair.id
        except:
            return JsonResponse({'result': False, 'code': 10039, 'msg': '不支持该交易对'})

        # TODO 价格保留科学计数法3位小数，需要对前端参数进行检查
        # TODO 价格是否需要限制，比如不超过当前最新价格的+—20%价格
        price = '%.3e' % Decimal(request.POST['price'])
        if Decimal(price) <= 0:
            return JsonResponse({'result': False, 'code': 10040, 'msg': '交易价格必须大于0'})

        # 数量
        quantity = DECIMAL_UP(Decimal(request.POST['quantity']))

        # TODO 下单数量下限要根据交易对调整
        if quantity < Decimal('0.01'):
            return JsonResponse({'result': False, 'code': 10075, 'msg': '交易数量必须大于0.01'})

        if quantity*Decimal(price) < Decimal('0.000005'):
            return JsonResponse({'result': False, 'code': 10090, 'msg': '交易金额必须大于0.000005'})

        # 方向
        direction = int(request.POST['direction'])
        if not direction in [0, 1]:
            return JsonResponse({'result': False, 'code': 10042, 'msg': '仅支持买单与卖单'})
        coin_type = pair.coin_type_a if direction == 0 else pair.coin_type_b

        # 动作
        action = int(request.POST['action'])
        try:
            ActionChoices.objects.get(code=action)
        except:
            return JsonResponse({'result': False, 'code': 10043, 'msg': '不支持该交易动作'})

        # 计算费率
        fee_type = 0
        # TODO  检查费率方式是否支持
        # FeeType.objects.get(id=data['fee_type'])
        fee = calc_fee(fee_type, price, quantity)

        # 是否允许系统自动撤销
        auto_cancel = True if request.POST['auto_cancel'] == 'true' else False

        # 是否设置有效期
        if request.POST['has_valid_time'] != 'false':
            valid_time = datetime.fromtimestamp(int(request.POST['valid_time']) / 1000, tz=timezone.utc)
        else:
            valid_time = None

        # trade_pwd（前端价格高于或低于最新成交价的20%，传递该参数）
        # 作用不太大(前端不传该参数则不进行校验)
        trade_pwd = request.POST.get('trade_pwd', None)
        if trade_pwd is not None:
            try:
                if not request.user.is_set_password:
                    return JsonResponse({'result': False, 'code': 10082, 'msg': '请先设置交易密码'})
                if not check_password(trade_pwd, request.user.trade_password):
                    return JsonResponse({'result': False, 'code': 10009, 'msg': '交易密码错误'})
            except:
                return JsonResponse({'result': False, 'code': 10009, 'msg': '交易密码错误'})
    except Exception as e:
        logger.debug(e)
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数格式错误'})

    # 检查用户资金是否充足
    try:
        if direction == 0:
            amount = DECIMAL_UP(Decimal(price) * quantity) + fee
        else:
            amount = quantity

        (balance, is_created) = Balances.objects.get_or_create(user=user, coin_type=coin_type)
        if balance.available < amount:
            return JsonResponse({'result': False, 'code': 10035, 'msg': '用户资金不足'})
    except:
        return JsonResponse({'result': False, 'code': 10022, 'msg': '获取用户资金失败'})
    # 参数检查结束

    # 向下单Topic推送Order
    try:
        order_data = {'order_type': 0, 'user_id': user.id, 'user_uid': user.uid, 'pair_id': pair_id,
                      'price': price, 'quantity': str(quantity), 'direction': direction,
                      'fee_type': fee_type, 'action': action,
                      'auto_cancel': auto_cancel, 'valid_time': valid_time}

        produce_order(order_data, build_topic(pair_id))

    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10044, 'msg': '交易下单异常'})

    if 'first_order' not in request.session:
        request.session['first_order'] = True

    return JsonResponse({'result': True, 'data': {'status': 1}})


@login_required
@require_GET
def get_order_list(request):
    try:
        user = request.user
        pair = PairChoices.objects.get(code=int(request.GET['pair_code']))
        status = request.GET.get('status', None)
        page = int(request.GET.get('page', 1))
        limit = int(request.GET.get('limit', 10))
        page = [page, 1][page < 1]
        limit = [limit, 10][limit < 1]
    except ObjectDoesNotExist as e:
        return JsonResponse({'result': False, 'code': 10039, 'msg': '不支持该交易对'})
    except Exception as e:
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数格式错误'})

    try:
        begin = limit * (page - 1)
        end = begin + limit
        data = []

        dic_action = {action.code: action.name for action in ActionChoices.objects.all()}

        if status is not None:
            # TODO 需要使用分页方法
            # 可以根据Transaction表查询，user_id1=user.id或user_id2=user.id，然后根据order_id1或order_id2获取相应参数
            orders = Order.objects.filter(user_id=user.id, pair_id=pair.id,
                                          status__in=[int(s) for s in status.split(',')]).order_by('-create_time')

            all_order_ids_sell = [o.pk for o in orders if o.direction == 1]
            all_order_ids_buy = [o.pk for o in orders if o.direction == 0]

            qs_transaction_info_buy = Transaction.objects.filter(order_id2__in=all_order_ids_sell)
            qs_transaction_info_sell = Transaction.objects.filter(order_id1__in=all_order_ids_buy)

            dic_transaction_info_buy = defaultdict(list)
            dic_transaction_info_sell = defaultdict(list)

            for t in qs_transaction_info_buy:
                dic_transaction_info_buy[t.order_id2].append(
                    {
                        'sell_price': t.price,
                        'sell_time': t.create_time,
                        'sell_fee': t.fee1,  # 卖单手续费
                        'sell_quantity': t.quantity
                    }
                )
            for t in qs_transaction_info_sell:
                dic_transaction_info_sell[t.order_id1].append(
                    {
                        'sell_price': t.price,
                        'sell_time': t.create_time,
                        'sell_fee': t.fee2,
                        'sell_quantity': t.quantity
                    }
                )

            for order in orders:
                # action = ActionChoices.objects.get(code=order.action)  blame
                transaction_buy_info = dic_transaction_info_buy.get(order.id, [])
                transaction_sell_info = dic_transaction_info_sell.get(order.id, [])
                for ti_buy in transaction_buy_info:
                    record = {
                            'order_id': order.id,
                            'order_code': order.order_code,
                            'direction': DIC_TRADE_ORDER_DIRECTION[order.direction],
                            'action': dic_action.get(order.action),
                            'quantity': order.quantity,
                            'price': order.price,
                            'fee': order.fee,
                            'create_time': order.create_time,
                            'valid_time': order.valid_time,
                            'status': DIC_TRADE_ORDER_STATUS[order.status],
                            'sell_price': ti_buy.get('sell_price'),
                            'sell_time': ti_buy.get('sell_time'),
                            'sell_fee': ti_buy.get('sell_fee'),
                            'sell_quantity': ti_buy.get('sell_quantity')
                        }
                    if len(transaction_buy_info) > 1:
                        record.update(status='部分成交')
                    data.append(record)

                for ti_sell in transaction_sell_info:
                    record = {
                        'order_id': order.id,
                        'order_code': order.order_code,
                        'direction': DIC_TRADE_ORDER_DIRECTION[order.direction],
                        'action': dic_action.get(order.action),
                        'quantity': order.quantity,
                        'price': order.price,
                        'fee': order.fee,
                        'create_time': order.create_time,
                        'valid_time': order.valid_time,
                        'status': DIC_TRADE_ORDER_STATUS[order.status],
                        'sell_price': ti_sell.get('sell_price'),
                        'sell_time': ti_sell.get('sell_time'),
                        'sell_fee': ti_sell.get('sell_fee'),
                        'sell_quantity': ti_sell.get('sell_quantity')
                    }
                    if len(transaction_sell_info) > 1:
                        record.update(status='部分成交')
                    data.append(record)
            data = data[begin:end]
        else:
            # TODO 应使用分页方法处理
            orders = Order.objects.filter(Q(user_id=request.user.id), Q(pair_id=pair.id),
                                          Q(status=0) | Q(status=1)).order_by('-create_time')[begin:end]

            for order in orders:
                # action = ActionChoices.objects.get(code=order.action)  blame
                if CancelOrder.objects.filter(order=order, status=0).exists():
                    order.status = 3

                data.append({
                    'order_id': order.id,
                    'order_code': order.order_code,
                    'direction': DIC_TRADE_ORDER_DIRECTION[order.direction],
                    'action': dic_action.get(order.action),
                    'quantity': order.quantity,
                    'price': order.price,
                    'fee': order.fee,
                    'create_time': order.create_time,
                    'valid_time': order.valid_time,
                    'status': DIC_TRADE_ORDER_STATUS[order.status]
                })


        return JsonResponse({
            'result': True,
            'data': data,
        })
    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10048, 'msg': '获取交易订单列表失败'})


@login_required
@require_POST
def cancel_order(request):
    try:
        user = request.user
        order_id = int(request.POST['order_id'])
        order = Order.objects.get(id=order_id)
        if order.status not in (0, 1):
            return JsonResponse({'result': False, 'code': 10074, 'msg': '当前状态不支持撤单'})
    except ObjectDoesNotExist:
        return JsonResponse({'result': False, 'code': 10045, 'msg': '无法获取交易订单信息'})
    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数格式错误'})

    # 撤消订单
    try:
        order_data = {'order_type': 1, 'user_uid': user.uid, 'order_id': order.id}
        produce_order(order_data, build_topic(order.pair_id))
    except Exception as e:
        logger.error(e)
        return JsonResponse({'result': False, 'code': 10046, 'msg': '提交撤单请求失败'})

    return JsonResponse({'result': True, 'data': {'status': 1}})


@login_required
@require_GET
def trade_list_30(request):
    try:
        return JsonResponse({
            "result": True,
            "data": {
                "bid": [[0.001045, 439.274498], [0.001043, 30.863854]],
                "asks": [[0.001046, 0.556406], [0.001052, 578.048266]],
                "trade_list": [["06-19 16:36:45", 0.001046, 1.443594, "sell"],
                               ["06-19 16:36:28", 0.001048, 505.843509, "sell"]],
                "update_time": 1498462280,
            }
        })
    except:
        return JsonResponse({'result': False, 'code': 10001, 'msg': '请求参数格式错误'})
