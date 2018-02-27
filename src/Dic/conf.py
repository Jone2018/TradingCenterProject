# -*- coding: utf-8 -*-
# from bidict import bidict

# 下单方向
DIC_TRADE_ORDER_DIRECTION = {
    0: '买单',
    1: '卖单'
}

# 订单状态
DIC_TRADE_ORDER_STATUS = {
    0: '未成交',
    1: '部分成交',
    2: '全部成交',
    3: '正在撤消',
    4: '部分撤消',
    5: '全部撤消',
}

# 订单取消的状态
DIC_TRADE_CANCELORDER_STATUS = {
    0: '正在撤消',
    1: '已撤消',
    2: '无法撤消'
}

# 订单类型
DIC_TRADE_ORDER_TYPE = {
    0: '普通订单',
    1: '撤消订单'
}

# 交易方向
DIC_TRADE_TRANSACTION_DIRECTION = {
    0: '买入',
    1: '卖出'
}

# 交易状态
# TODO 撮合生成的交易首先是待成交状态，当异步完成资金过户和扣除手续费后，状态变更为已成交
DIC_TRADE_TRANSACTION_STATUS = {
    0: '已成交',
    1: '已撤消',
    2: '待成交'
}

# ico 项目状态
DIC_ICOPROJECT_STATUS = {
    0: '未提交',
    1: '待审核',
    2: '即将开始',
    3: '进行中',
    4: '已锁定',
    5: '已成功',
    6: '失败',
    7: '未通过',
    8: '审核通过'
}

# ico 订单状态
DIC_ICOORDER_STATUS = {
    0: '已提交',
    1: '已撤销',
    2: '已锁定',
    3: '已中标',
    4: '候补',
    5: '出局',
    6: '待认购',
    7: '弃标',
    8: '已过期',
    9: '认购成功'
}

# 充值提现类型
DIC_CHARGE_DIRECTION = {
    0: '充值',
    1: '提现'
}

# 充值状态
DIC_CHARGE_STATUS = {
    0: '确认中',
    1: '已确认',
    2: '已撤销'
}

DIC_WKC_CHARGE_STATUS = {
    0: '确认中',
    1: '已撤销',
    2: '确认成功',
    3: '确认失败'
}

# 提现状态
DIC_WITHDRAW_STATUS = {
    10: '审核中',
    11: '审核通过',
    12: '审核未通过',
    13: '已汇出',
    14: '已撤销'
}

# 资金冻结状态
DIC_FROZEN_STATUS = {
    0: '已冻结',
    1: '已解冻',
}

# 资金解冻状态
DIC_UNFROZEN_STATUS = {
    0: '已解冻',
    1: '已冻结',
}

# 资金过户状态
DIC_TRANSFER_STATUS = {
    0: '已过户',
    1: '已取消'
}

# 资金转账状态
DIC_FORWARD_STATUS = {
    0: '已转账',
    1: '已取消'
}

# 资金发放状态
DIC_DISPATCH_STATUS = {
    20: '已到账',
    21: '已取消'
}

# 手续费状态
DIC_FEE_STATUS = {
    0: '已扣除',
    1: '已取消'
}

# 财务记录类型
DIC_FINANCE_TYPE = {
    0: '充值订单',
    1: '提现订单',
    2: '资金发放',
    3: '资金过户（已删除）',
    4: '手续费（已删除）',
    5: '资金冻结（已删除）',
    6: '资金解冻（已删除）',
    7: '资金转账'
}

# 财务历史记录类型索引
DIC_FINANCEHISTORY_INDEX = {
    0: [0, 1, 2],            # 充值
    1: [10, 11, 12, 13, 14], # 提现
    3: [30, 31, 32],         # 发放
    4: [40, 41, 42, 43, 44], # 交易
    7: [70, 71, 72, 73],     # 转账
}

# 财务历史记录类型
DIC_FINANCEHISTORY_TYPE = {
    ### 0: 充值订单  BalanceCharge
    0: '充值确认中',
    1: '充值已确认',
    2: '充值已取消',

    ### 1: 提现订单 BalanceWithdraw
    10: '提现申请',
    11: '提现审核成功',
    12: '提现审核失败',
    13: '提现已汇出',
    14: '提现取消',

    ### 2: ICO订单  ICOOrder
    20: 'ICO订单提交',
    21: 'ICO订单撤销',
    22: 'ICO订单放弃候补',
    23: 'ICO订单放弃中标',
    24: 'ICO订单认购成功',

    ### 3: 发放订单 BalanceDispatch
    30: '资金发放',
    31: '资金发放取消',
    32: 'ulogos清退',

    ### 4: 交易订单 Order
    40: '交易订单提交',
    41: '交易订单撤消',
    42: '交易订单返还',
    43: '交易订单收入',
    44: '交易订单支出',

    ### 7: 转账订单 BalanceForward
    70: '转账收入',
    71: '转账支出',
    72: '转账收入取消',
    73: '转账支出取消'
}

# 工单处理状态
DIC_QUESTION_STATUS = {
    0: '待处理',
    1: '已处理'
}

# 工单问题类型
DIC_QUESTION_TYPE = {
    0: '充值',
    1: '提现',
    2: '账户',
    3: '转账',
    4: '其它'
}

# 公告状态
DIC_NOTICE_STATUS = {
    0: '未激活',
    1: '已激活'
}

# 站内消息类型
DIC_MESSAGE_TYPE = {
    0: '通知',
    1: '活动',
    2: '其它'
}

# 公告类型
DIC_NOTICE_TYPE = {
    0: '官方公告',
    1: '论证公告',
    2: '停牌公告'
}


