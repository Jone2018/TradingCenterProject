# -*- coding: utf-8 -*-
from __future__ import division
from __future__ import unicode_literals

import time
from decimal import Decimal

import redis
from bitcoin.base58 import Base58Error
from bitcoin.wallet import CBitcoinAddress
from django.contrib.auth.hashers import check_password
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q
from django.views.decorators.http import require_GET, require_POST
from phonenumber_field.phonenumber import *

from Account.alimns import *
from Account.models import User
from Dic.conf import *
from Dic.models import CoinType
from .common import (
    fail, success,
    check_coin_type, check_phone_captcha, check_email_captcha, check_captcha,
    check_withdraw_upper_limit
)
from .decorators import login_required
from .exceptions import *
from .models import (
    WithdrawAddress, DepositAddress,
    Balances, BalanceLog, BalanceCharge, WKCBalanceCharge,
    BalanceWithDraw, BalanceDispatch,
    BalanceForward, BalanceHistory,
    create_balance_withdraw, create_balance_forward,
    CoinTypeProperty, create_ulogos_dispatch, create_wkc_charge
)
from .utils import verify_signature

logger = logging.getLogger(__name__)
redis_server = redis.StrictRedis(host=settings.REDIS_HOST, port=6379, db=0, password=settings.REDIS_PWD)


# 获取所有币种余额
# is_zero 1 返回所有非0余额数据  0 返回所有余额数据
@login_required
@require_GET
def get_funds(request):
    try:
        user = request.user
        is_zero = int(request.GET['is_zero'])
    except Exception as e:
        logger.error(e)
        return fail()

    try:
        data = []
        coin_types = CoinType.objects.filter(is_allow_display=True)

        for coin_type in coin_types:
            coin, is_created = Balances.objects.get_or_create(user=user, coin_type=coin_type.id)
            if not (is_zero == 0 and coin.frozen == 0.0 and coin.available == 0.0 and coin.unconfirmed == 0.0):
                data.append({
                    "coin_type": coin_type.id,
                    "coid_no": coin_type.no,
                    "coin_name": coin_type.name,
                    "frozen": coin.frozen,
                    'available': coin.available,
                    'unconfirm': coin.unconfirmed,
                    'is_allow_charge': coin_type.is_allow_charge,
                    'is_allow_withdrow': coin_type.is_allow_withdraw,
                    'is_allow_transfer': coin_type.is_allow_transfer
                })
        return success(data)
    except Exception as e:
        logger.error(e)
        return fail(10022, '获取用户资金失败')


# 获取单个币种余额
@login_required
@require_GET
def get_fund(request):
    try:
        user = request.user
        coin_type = int(request.GET['coin_type'])
        check_coin_type(coin_type)
    except APIException as e:
        return fail(e.code, e.message)
    except Exception as e:
        logger.error(e)
        return fail()

    try:
        ct = CoinType.objects.get(id=coin_type)
        coin = Balances.objects.get(user=user, coin_type=coin_type)
        data = {
            'coin_type': coin_type,
            'frozen': coin.frozen,
            'available': coin.available,
            'unconfirm': coin.unconfirmed,
            'is_allow_charge': ct.is_allow_charge,
            'is_allow_withdrow': ct.is_allow_withdraw,
            'is_allow_transfer': ct.is_allow_transfer
        }
        return success(data)
    except Exception as e:
        logger.error(e)
        return fail(10022, '获取用户资金失败')


# 获取充币地址
@login_required
@require_GET
def get_coin_address(request):
    try:
        user = request.user
        coin_type = int(request.GET['coin_type'])
        check_coin_type(coin_type)
    except CoinTypeNotFoundException as e:
        return fail(e.code, e.message)
    except Exception as e:
        logger.error(e)
        return fail()

    try:
        try:
            deposit_address = user.deposit_address.get(coin_type=coin_type)
        except DepositAddress.DoesNotExist:
            deposit_address = DepositAddress.objects.create_address(user, coin_type)

        if deposit_address.is_active:
            data = {'address': deposit_address.address}
            return success(data)
        else:
            return fail(10071, '充币地址被禁用')
    except Exception as e:
        logger.error(e)
        return fail(10018, '获取充币地址失败')


# 获取提币地址
@login_required
@require_GET
def get_address_list(request):
    try:
        user = request.user
        coin_type = int(request.GET['coin_type'])
        check_coin_type(coin_type)
    except APIException as e:
        return fail(e.code, e.message)
    except Exception as e:
        logger.error(e)
        return fail()

    try:
        withdrawAddress = WithdrawAddress.objects.filter(coin_type=coin_type,
                                                         user=user, is_active=True)
        data = []
        if withdrawAddress:
            for item in withdrawAddress:
                data.append({
                    "label": item.label,
                    "address": item.address,
                    "is_verified": item.is_verified
                })
        return success(data)
    except Exception as e:
        logger.error(e)
        return fail(10027, '获取提币地址失败')


# 添加提币地址
@login_required
@require_POST
def add_address(request):
    try:
        user = request.user
        coin_type = int(request.POST['coin_type'])
        check_coin_type(coin_type)
        address = request.POST['address']
        label = request.POST['label']
        is_verified = bool(request.POST['is_verified'])

        if WithdrawAddress.objects.filter(user=user, label=label, is_active=True).exists():
            return fail(10034, '该标签已添加过，请检查标签信息')
        if WithdrawAddress.objects.filter(user=user, coin_type=coin_type, address=address, is_active=True).exists():
            return fail(10034, '该地址已添加过，请检查地址信息')

        if coin_type == 6:
            if not (address.startswith('0x') and len(address) == 42):
                return fail(code=10115, message='玩客币地址格式不正确')
        elif coin_type == 1:
            try:
                CBitcoinAddress(address)
            except Base58Error:
                return fail(10098, '比特币地址输入不正确')

        if request.POST['captcha_type'] == 'phone':
            check_phone_captcha(request.POST['phone_number'], request.POST['captcha'])
        elif request.POST['captcha_type'] == 'email':
            check_email_captcha(request.POST['email'], request.POST['captcha'])

    except APIException as e:
        return fail(e.code, e.message)
    except Exception as e:
        logger.error(e)
        return fail()

    try:
        WithdrawAddress.objects.create(coin_type=coin_type, user=user,
                                       address=address, label=label, is_verified=is_verified)
        return success()
    except Exception as e:
        logger.error(e)
        return fail(10024, '新增提币地址失败')


# 删除提币地址
@login_required
@require_POST
def del_wdr_addr(request):
    try:
        user = request.user
        label = request.POST['label']
    except Exception as e:
        logger.error(e)
        return fail()

    try:
        wa = WithdrawAddress.objects.get(label=label, user=user, is_active=True)
        wa.is_active = None
        wa.save()
        return success()
    except Exception as e:
        logger.error(e)
        return fail(10049, '删除提币地址失败')


# 用户申请提币
@login_required
# @realname_required
@require_POST
def withdraw(request):
    try:
        user = request.user
        coin_type = int(request.POST['coin_type'])
        check_coin_type(coin_type)
        address = request.POST['address']

        amount = Decimal(request.POST['amount'])
        property = CoinTypeProperty.objects.get(coin_type=coin_type)
        single_limit = property.single_limit
        low_limit = property.low_limit
        if amount < low_limit or amount > single_limit:
            return fail(10029, '请确认提现数量，必须大于等于{}且小于等于{}'.format(low_limit, single_limit))

        fee = property.withdraw_fee
        # fee = Decimal(request.POST['fee'])
        # fee_limit = get_withdraw_fee(coin_type)
        # if float(fee) < fee_limit or fee > amount:
        #     return fail(10029, '提现手续费不得小于{}'.format(fee_limit))

        check_withdraw_upper_limit(user, coin_type, amount)

        if request.POST['captcha_type'] == 'phone':
            check_phone_captcha(request.POST['phone_number'], request.POST['captcha'])

        elif request.POST['captcha_type'] == 'email':
            check_email_captcha(request.POST['email'], request.POST['captcha'])
    except APIException as e:
        return fail(e.code, e.message)
    except Exception as e:
        logger.error(e)
        return fail()

    try:
        create_balance_withdraw(user, coin_type, address, amount, fee)
        return success()
    except Exception as e:
        logger.error(e)
        return fail(10026, '申请提币失败')


# 取消提币
@login_required
@require_POST
def cancel_withdraw(request):
    try:
        user = request.user
        id = int(request.POST['id'])
    except Exception as e:
        logger.error(e)
        return fail()

    try:
        log = BalanceLog.objects.get(id=id)
        if log.finance_type == 1:
            wd = BalanceWithDraw.objects.get(id=log.order_id)
            wd.cancel()
            return success()
        else:
            return fail(10025, '取消提币失败')
    except Exception as e:
        logger.error(e)
        return fail(10025, '取消提币失败')


# 查看财务记录
@login_required
@require_GET
def user_balance_log(request):
    try:
        user = request.user
        charge_pro = int(request.GET['charge_pro'])  # 是否只显示充提记录
        num_per_page = int(request.GET['num_per_page'])  # 每页个数
        page = int(request.GET['page'])  # 当前页码
    except Exception as e:
        logger.error(e)
        return fail()

    try:
        if charge_pro == 1:
            # 充提记录
            orders = BalanceLog.objects.filter(Q(finance_type=0) | Q(finance_type=1),
                                               user=user).order_by('-timestamp')
        else:
            # 充提记录，发放记录，转账记录
            orders = BalanceLog.objects.filter(Q(finance_type=0) | Q(finance_type=1) |
                                               Q(finance_type=2) | Q(finance_type=7),
                                               user=user).order_by('-timestamp')

        # 分页功能
        # 接口输入参数（每页个数num_per_page，当前页码page）
        # 输出参数（总页数num_pages，当前页内容data）
        paginator = Paginator(orders, num_per_page)
        try:
            orders = paginator.page(page).object_list
        except PageNotAnInteger:
            orders = paginator.page(1).object_list
        except EmptyPage:
            orders = paginator.page(paginator.num_pages).object_list

        coin_code = {ct.id: ct.code for ct in CoinType.objects.all()}
        data = []

        for order in orders:
            dt = {
                'id': order.id,
                'finance_type': order.finance_type,
                'coin_type': order.coin_type,
                'name': coin_code[order.coin_type] + DIC_FINANCE_TYPE[order.finance_type],
                'timestamp': order.timestamp
            }

            if order.finance_type == 0:  # 充值
                wd = BalanceCharge.objects.get(id=order.order_id)
                dt['txid'] = wd.txid
                dt['amount'] = wd.amount
                dt['status'] = wd.status
                dt['actual_amount'] = wd.amount
            elif order.finance_type == 1:  # 提现
                wd = BalanceWithDraw.objects.get(id=order.order_id)
                dt['txid'] = wd.txid
                dt['amount'] = wd.amount
                dt['status'] = wd.status
                dt['actual_amount'] = wd.actual_amount
            elif order.finance_type == 2:  # 发放
                wd = BalanceDispatch.objects.get(id=order.order_id)
                dt['txid'] = wd.tx_id
                dt['amount'] = wd.amount
                dt['status'] = wd.status
                dt['actual_amount'] = wd.amount
            elif order.finance_type == 7:  # 转账
                wd = BalanceForward.objects.get(id=order.order_id)
                dt['txid'] = wd.id
                dt['amount'] = wd.amount
                dt['status'] = wd.status
                dt['actual_amount'] = wd.amount
                if user.id == wd.send_user_id:
                    dt['name'] = '向用户{}转出{}'.format(wd.recv_user.uid, coin_code[order.coin_type])
                else:
                    dt['name'] = '用户{}转入{}'.format(wd.send_user.uid, coin_code[order.coin_type])
            data.append(dt)
        return success(data, num_pages=paginator.num_pages)
    except Exception as e:
        logger.error(e)
        return fail(10023, '获取财务记录失败')


# 获取用户账单详情
@login_required
@require_GET
def user_balance_history(request):
    try:
        user = request.user
        finance_type = int(request.GET['finance_type'])
        coin_type = int(request.GET['coin_type'])
        begin_time = time.strftime("%Y-%m-%d %X", time.strptime(request.GET['begin_time'], "%Y-%m-%d %H:%M"))
        end_time = time.strftime("%Y-%m-%d %X", time.strptime(request.GET['end_time'], "%Y-%m-%d %H:%M"))
        size = request.GET.get('size')  # 每页个数
        page = request.GET.get('page')  # 当前页码

        if finance_type != -1 and finance_type not in DIC_FINANCEHISTORY_INDEX:
            raise Exception('不支持的账单类型')
        coin_code = [ct.id for ct in CoinType.objects.filter(is_allow_display=True)]
        if coin_type != -1 and coin_type not in coin_code:
            raise Exception('不支持的币种类型')

        size = int(size) if size is not None else 10
        size = size if size > 0 else 10
        page = int(page) if page is not None else 1
        page = page if page > 0 else 1
    except Exception as e:
        logger.error(e)
        return fail()

    try:
        query = BalanceHistory.objects.filter(balance__user_id=user.id)
        if finance_type != -1:
            categories = DIC_FINANCEHISTORY_INDEX[finance_type]
            query = query.filter(category__in=categories)
        if coin_type != -1:
            query = query.filter(balance__coin_type=coin_type)
        else:
            query = query.filter(balance__coin_type__in=coin_code)
        histories = query.filter(timestamp__range=(begin_time, end_time))

        # 分页功能
        # 接口输入参数（每页个数num_per_page，当前页码page）
        # 输出参数（总页数num_pages，当前页内容data）
        paginator = Paginator(histories, size)
        try:
            histories = paginator.page(page).object_list
        except PageNotAnInteger:
            histories = paginator.page(1).object_list
        except EmptyPage:
            histories = paginator.page(paginator.num_pages).object_list

        data = list()
        for history in histories:
            data.append({
                "timestamp": history.timestamp,
                "coin_type": history.balance.coin_type,
                "amount": history.amount,
                "fee": history.fee,
                "available": history.available,
                "frozen": history.frozen,
                "unconfirmed": history.unconfirmed,
                "reason": history.reason,
            })
        return success(data, num_pages=paginator.num_pages)
    except Exception as e:
        logger.error(e)
        return fail(10105, '获取账单详情失败')


# 平台内转账
@login_required
# @realname_required
@require_POST
def transfer(request):
    # 检查参数是否正确
    try:
        uid = int(request.POST['uid'])
        email = request.POST.get('email', None)
        phone_number = request.POST.get('phone_num', None)
        if phone_number:
            try:
                phone_number = PhoneNumber.from_string(phone_number)
            except Exception as e:
                return fail(10003, '手机号码格式不正确')

        coin_type = int(request.POST['coin_type'])
        coin_code = check_coin_type(coin_type)

        quantity = Decimal(request.POST['quantity'])
        if quantity < 0:
            return fail(10081, '转账数量必须大于0')
        trade_password = request.POST['trade_password']
        send_user = request.user
    except Exception as e:
        logger.error(e)
        return fail(10027, '请求参数错误')

    # 检查对方账户信息是否正确
    try:
        recv_user = User.objects.get(uid=uid)
        if not recv_user.is_active:
            return fail(10080, '对方账户未激活')

        if recv_user.id == send_user.id:
            return fail(10079, '不能给自己转账')

        if phone_number is None and email is None:
            return fail(10076, '手机号或邮箱不能同时为空')

        if email is not None and recv_user.email == email:
            if not recv_user.is_email_verified:
                return fail(10077, '对方电子邮件未通过认证')
        elif phone_number is not None and recv_user.phone_number == phone_number:
            if not recv_user.is_phone_verified:
                return fail(10077, '对方手机未通过认证')
        else:
            return fail(10077, '对方手机号码或邮箱不正确')

    except User.DoesNotExist:
        return fail(10075, '对方账户不存在')
    except Exception as e:
        return fail(10077, '对方账户信息不正确')

    # 判断交易密码是否正确
    try:
        if not send_user.is_set_password:
            return fail(10076, '请先设置交易密码')

        if not check_password(trade_password, send_user.trade_password):
            return fail(10009, '交易密码错误')
    except:
        return fail(10009, '交易密码错误')

    # 检查用户资金是否充足
    try:
        (balance, is_created) = Balances.objects.get_or_create(user=request.user, coin_type=coin_type)
        if balance.available < quantity:
            return fail(10035, '用户资金不足')
    except:
        return fail(10022, '获取用户资金失败')

    # 进行汇款操作
    try:
        create_balance_forward(send_user, recv_user, coin_type, quantity, send_fee=0, recv_fee=0)
    except Exception as e:
        logger.error(e)
        return fail(10078, '转账失败')

    # 汇款方短信通知
    try:
        if send_user.is_phone_verified:
            amount_cointype = '{0}{1}'.format(quantity, coin_code)
            send_sms(send_user.phone_number, 'SMS_82135097',
                     {'code': str(send_user.uid), 'amount': amount_cointype})
    except Exception as e:
        logger.warning('用户转账汇款方短信通知失败，{0}'.format(e))

    # 收款方短信通知
    try:
        if recv_user.is_phone_verified:
            amount_cointype = '{0}{1}'.format(quantity, coin_code)
            send_sms(recv_user.phone_number, 'SMS_82970014',
                     {'code': str(send_user.uid), 'amount': amount_cointype})
    except Exception as e:
        logger.warning('用户转账收款方短信通知失败，{0}'.format(e))

    return success()


# 获取币种属性（提币手续费、限额）
@require_GET
def cointype_property(request):
    try:
        coin_type = int(request.GET['coin_type'])
    except Exception as e:
        logger.error(e)
        return fail()

    try:
        coin_code = {ct.id: ct.code for ct in CoinType.objects.all()}
        if coin_type not in coin_code:
            return fail()
        ctp = CoinTypeProperty.objects.get(coin_type=coin_type)
        data = {
            'coin_type': coin_type,
            'withdraw_fee': ctp.withdraw_fee,
            'single_limit': ctp.single_limit,
            'day_limit': ctp.day_limit,
            'low_limit': ctp.low_limit
        }
        return success(data)
    except Exception as e:
        logger.error(e)
        return fail()


# 快照领币
@login_required
@require_POST
def send_ulogos(request):
    try:
        user = request.user
        address = CBitcoinAddress(request.POST['address'])
        if not str(address).startswith('1'):
            return fail(10104, '暂不支持该类型比特币地址领取ULOGOS')
        signature = request.POST['signature']
        if not verify_signature(address, signature):
            return fail(10099, '签名不正确')
    except Base58Error:
        return fail(10098, '比特币地址输入不正确')
    except Exception as e:
        logger.error(e)
        return fail()

    try:
        balance = redis_server.get(str(address))
        if not balance:
            return fail(10101, '比特币区块高度478558快照中不存在该地址')
        balance = Decimal(str(balance)) / 100000000
        if balance <= 0:
            return fail(10102, '比特币地址余额不对')
    except Exception as e:
        logger.error(e)
        return fail(10103, '比特币地址余额获取失败')

    try:
        create_ulogos_dispatch(user, str(address), signature, balance)
        return success(data={'btc': balance, 'ulogos': balance, 'bitcoinlogo': balance})
    except Exception as e:
        logger.error(e)
        return fail(10100, '您已提交过领币申请，请勿重复提交')


# 用户申请玩客币充值
@login_required
@require_POST
def wkc_charge(request):
    try:
        user = request.user
        address = request.POST['address']
        if not (address.startswith('0x') and len(address) == 42):
            return fail(code=10115, message='玩客币地址格式不正确')

        amount = Decimal(request.POST['amount']).quantize(Decimal('0.00000001'))
        if amount < Decimal('1'):
            return fail(code=10116, message='玩客币充值数量必须至少为1')

        check_captcha(key=request.POST['captcha_key'], value=request.POST['captcha_value'])
    except APIException as e:
        return fail(e.code, e.message)
    except Exception as e:
        logger.error(e)
        return fail()

    try:
        create_wkc_charge(user, address, amount)
        return success()
    except Exception as e:
        logger.error(e)
        return fail(10026, '创建充值订单失败')


# 用户取消玩客币充值
@login_required
@require_POST
def cancel_wkc_charge(request):
    try:
        user = request.user
        id = int(request.POST['id'])
    except Exception as e:
        logger.error(e)
        return fail()

    try:
        order = WKCBalanceCharge.objects.get(id=id, user=user)
        order.cancel()
        return success()
    except Exception as e:
        logger.error(e)
        return fail(10025, '撤销充值订单失败')


# 查看玩客币充值订单列表
@login_required
@require_GET
def wkc_charge_list(request):
    try:
        user = request.user
        num_per_page = int(request.GET['num_per_page'])  # 每页个数
        page = int(request.GET['page'])  # 当前页码
    except Exception as e:
        logger.error(e)
        return fail()

    try:
        orders = WKCBalanceCharge.objects.filter(user=user)

        # 分页功能
        # 接口输入参数（每页个数num_per_page，当前页码page）
        # 输出参数（总页数num_pages，当前页内容data）
        paginator = Paginator(orders, num_per_page)
        try:
            orders = paginator.page(page).object_list
        except PageNotAnInteger:
            orders = paginator.page(1).object_list
        except EmptyPage:
            orders = paginator.page(paginator.num_pages).object_list

        data = []

        for order in orders:
            dt = {
                'id': order.id,
                'create_time': order.create_time,
                'address': order.address,
                'amount': order.amount,
                'status': DIC_WKC_CHARGE_STATUS[order.status]
            }
            data.append(dt)
        return success(data, num_pages=paginator.num_pages)
    except Exception as e:
        logger.error(e)
        return fail(10023, '充值订单列表失败')
