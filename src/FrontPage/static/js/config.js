var realNameHost = 'https://suiqiu-reainame.oss-cn-shanghai.aliyuncs.com/';
var siteConfig = {
    "coin_type": [
        {
            "coin_id": 1,
            "code": "BTC",
            "name": gettext('比特币'),
            "fname": gettext('BTC比特币'),
            "src": "/static/images/icon_btc.png",
            "explorer": "https://blockchain.info/tx/{txid}"
        },
        {
            "coin_id": 2,
            "code": "ETH",
            "name": "以太坊",
            "fname":"ETH以太坊",
            "src": "/static/images/icon_eth.png",
            "explorer": "https://etherscan.io/tx/{txid}"
        },
        {
            "coin_id": 3,
            "code": "ETC",
            "name": "以太经典",
            "fname":"ETC以太经典",
            "src": "/static/images/icon_etc.png",
            "explorer": "http://gastracker.io/tx/{txid}"
        },
        {
            "coin_id": 4,
            "code": "ULOGOS",
            "name": "ULOGOS",
            "fname":"ULOGOS",
            "src": "/static/images/icon_ulogos.png"
        },
        {
            "coin_id": 5,
            "code": "BITCOIN LOGO",
            "name": "BITCOIN LOGO",
            "fname":"BITCOIN LOGO",
            "src": "/static/images/icon_bitcoinlogo.png"
        },
        {
            "coin_id": 6,
            "code": "WKC",
            "name": gettext("玩客币"),
            "fname": gettext("WKC玩客币"),
            "src": "/static/images/icon_wkc.png",
        },
        {
            "coin_id": 7,
            "code": "SNGLS",
            "name": "SingularDTV",
            "fname": "SingularDTV",
            "src": "/static/images/icon_sngls.png",
            "explorer": "https://etherscan.io/tx/{txid}"
        },
        {
            "coin_id": 8,
            "code": "MKR",
            "name": "Maker",
            "fname": "Maker",
            "src": "/static/images/icon_mkr.png",
            "explorer": "https://etherscan.io/tx/{txid}"
        },
        {
            "coin_id": 9,
            "code": "BCAP",
            "name": "BCAP",
            "fname": "BCAP",
            "src": "/static/images/icon_bcap.png",
            "explorer": "https://etherscan.io/tx/{txid}"
        },
        {
            "coin_id": 10,
            "code": "AGRS",
            "name": "IDNI Agoras",
            "fname": "IDNI Agoras",
            "src": "/static/images/icon_agrs.png",
            "explorer": "http://omniexplorer.info/lookuptx.aspx?txid={txid}"
        },
        {
            "coin_id": 11,
            "code": "XPM",
            "name": "primecoin",
            "fname": "XPM质数币",
            "src": "/static/images/icon_xpm.png",
            "explorer": "https://bchain.info/XPM/tx/{txid}"
        },
        {
            "coin_id": 12,
            "code": "KIN",
            "name": "Kin",
            "fname": "Kin",
            "src": "/static/images/icon_kin.png",
            "explorer": "https://etherscan.io/tx/{txid}"
        },
        {
            "coin_id": 13,
            "code": "NMR",
            "name": "Numeraire",
            "fname": "Numeraire",
            "src": "/static/images/icon_nmr.png",
            "explorer": "https://etherscan.io/tx/{txid}"
        },
        {
            "coin_id": 14,
            "code": "BCC",
            "name": "Bitcoin Cash",
            "fname":"BCC比特现金",
            "src": "/static/images/icon_bcc.png",
            "explorer": "https://www.blocktrail.com/BCC/tx/{txid}"
        },
        {
            "coin_id": 15,
            "code": "TEL",
            "name": "Telcoin",
            "fname":"Telcoin",
            "src": "/static/images/icon_tel.png",
        },
        {
            "coin_id": 16,
            "code": "USDT",
            "name": "Tether",
            "fname":"Tether",
            "src": "/static/images/icon_usdt.png",
        },
    ],
    "pair_choice": [
        {
            "code":10003,
            "name": gettext("WKC玩客币"),
            "icon":"icon_wkc",
            "coin_type_a":1,
            "coin_type_b":6
        },
        {
            "code": 10000,
            "name": "ULOGOS",
            "icon":"icon_btc",
            "coin_type_a": 1,
            "coin_type_b": 4
        },
        {
            "code": 10001,
            "name": "BITCOIN LOGO",
            "icon":"icon_btc",
            "coin_type_a": 1,
            "coin_type_b": 5
        },
        {
            "code": 10002,
            "name": gettext("ETH以太坊"),
            "icon": "icon_eth",
            "coin_type_a": 1,
            "coin_type_b": 2
        },
        {
            "code": 10003,
            "name": gettext("WKC玩客币"),
            "icon": "icon_eth",
            "coin_type_a": 1,
            "coin_type_b": 6
        },
        {
            "code": 10004,
            "name": "SingularDTV",
            "icon": "icon_sngls",
            "coin_type_a": 1,
            "coin_type_b": 7
        },
        {
            "code": 10005,
            "name": "Maker",
            "icon": "icon_mkr",
            "coin_type_a": 1,
            "coin_type_b": 8
        },
        {
            "code": 10006,
            "name": "BCAP",
            "icon": "icon_bcap",
            "coin_type_a": 1,
            "coin_type_b": 9
        },
        {
            "code": 10007,
            "name": "IDNI Agoras",
            "icon": "icon_agrs",
            "coin_type_a": 1,
            "coin_type_b": 10
        },
        {
            "code": 10008,
            "name": "XPM质数币",
            "icon": "icon_xpm",
            "coin_type_a": 1,
            "coin_type_b": 11
        },
        {
            "code": 10009,
            "name": "Kin",
            "icon": "icon_kin",
            "coin_type_a": 1,
            "coin_type_b": 12
        },
        {
            "code": 10010,
            "name": "Numeraire",
            "icon": "icon_nmr",
            "coin_type_a": 1,
            "coin_type_b": 13
        },
        {
            "code": 10011,
            "name": "ETC以太经典",
            "icon": "icon_etc",
            "coin_type_a": 1,
            "coin_type_b": 3
        },
        {
            "code": 10012,
            "name": "BCC比特现金",
            "icon": "icon_bcc",
            "coin_type_a": 1,
            "coin_type_b": 14
        },
        {
            "code": 10013,
            "name": "TEL",
            "icon": "icon_tel",
            "coin_type_a": 1,
            "coin_type_b": 15
        },
        {
            "code": 10014,
            "name": "ETH以太坊",
            "icon": "icon_eth",
            "coin_type_a": 16,
            "coin_type_b": 2
        }
    ],
    "language": [
        {
            "code": "en",
            "name": "英文",
            "name_local": "English",
            "icon": "/static/images/icon_usa.png"
        },
        {
            "code": "zh-hans",
            "name": "中文简体",
            "name_local": "中文简体",
            "icon": "/static/images/icon_china.png"
        },
        {
            "code": "zh-hant",
            "name": "中文繁体",
            "name_local": "中文繁體",
            "icon": "/static/images/icon_china.png"
        }
    ],
    "errors": [
        {
            "code": 0,
            "msg": gettext("错误请求")
        },
        {
            "code": 10000,
            "msg": gettext("用户未登录")
        },
        {
            "code": 10001,
            "msg": gettext("请求参数格式错误")
        },
        {
            "code": 10002,
            "msg": gettext("获取图像验证码失败")
        },
        {
            "code": 10003,
            "msg": gettext("手机号码格式不正确")
        },
        {
            "code": 10004,
            "msg": gettext("手机验证码已发送，请耐心等待")
        },
        {
            "code": 10005,
            "msg": gettext("手机验证码发送失败")
        },
        {
            "code": 10006,
            "msg": gettext("手机号码不能为空")
        },
        {
            "code": 10007,
            "msg": gettext("验证码校验失败")
        },
        {
            "code": 10008,
            "msg": gettext("验证码不能为空")
        },
        {
            "code": 10009,
            "msg": gettext("两次输入的密码不一致")
        },
        {
            "code": 10010,
            "msg": gettext("密码至少需要8位")
        },
        {
            "code": 10011,
            "msg": gettext("用户注册失败")
        },
        {
            "code": 10012,
            "msg": gettext("用户名或密码错误")
        },
        {
            "code": 10013,
            "msg": gettext("用户名或密码不能为空")
        },
        {
            "code": 10014,
            "msg": gettext("用户名必须以字母开头，长度在4-18之间，且只能包含字母、数字和下划线")
        },
        {
            "code": 10015,
            "msg": gettext("用户未激活")
        },
        {
            "code": 10016,
            "msg": gettext("输入密码错误")
        },
        {
            "code": 10017,
            "msg": gettext("密码不能为空")
        },
        {
            "code": 10018,
            "msg": gettext("增加BTC地址失败")
        },
        {
            "code": 10019,
            "msg": gettext("该手机号码未注册")
        },
        {
            "code": 10020,
            "msg": gettext("该手机号码已注册")
        },
        {
            "code": 10021,
            "msg": gettext("无法获取ICO项目信息")
        },
        {
            "code": 10022,
            "msg": gettext("获取用户资金失败")
        },
        {
            "code": 10023,
            "msg": gettext("获取财务记录失败")
        },
        {
            "code": 10024,
            "msg": gettext("新增提币地址失败")
        },
        {
            "code": 10025,
            "msg": gettext("取消提币失败")
        },
        {
            "code": 10026,
            "msg": gettext("提币失败")
        },
        {
            "code": 10027,
            "msg": gettext("获取提币地址失败")
        },
        {
            "code": 10028,
            "msg": gettext("请确认充值数量，必须为数字")
        },
        {
            "code": 10029,
            "msg": gettext("请确认充值数量，必须大于0.001")
        },
        {
            "code": 10030,
            "msg": gettext("提交ICO订单失败")
        },
        {
            "code": 10031,
            "msg": gettext("请确认提现数量，提现数量必须小于可用余额")
        },
        {
            "code": 10032,
            "msg": gettext("无法获取ICO订单信息")
        },
        {
            "code": 10033,
            "msg": gettext("找不到此币种，请确认币种信息")
        },
        {
            "code": 10034,
            "msg": gettext("该地址备注已添加过，请重新添加备注信息")
        },
        {
            "code": 10035,
            "msg": gettext("用户资金不足")
        },
        {
            "code": 10036,
            "msg": gettext("冻结资金失败")
        },
        {
            "code": 10037,
            "msg": gettext("订单数据为空")
        },
        {
            "code": 10038,
            "msg": gettext("解冻资金失败")
        },
        {
            "code": 10039,
            "msg": gettext("不支持该交易对")
        },
        {
            "code": 10040,
            "msg": gettext("交易价格必须大于0")
        },
        {
            "code": 10041,
            "msg": gettext("交易数量必须大于0")
        },
        {
            "code": 10042,
            "msg": gettext("仅支持买单与卖单")
        },
        {
            "code": 10043,
            "msg": gettext("不支持该交易动作")
        },
        {
            "code": 10044,
            "msg": gettext("交易下单失败")
        },
        {
            "code": 10045,
            "msg": gettext("无法获取交易订单信息")
        },
        {
            "code": 10046,
            "msg": gettext("撤消交易订单失败")
        },
        {
            "code": 10047,
            "msg": gettext("估值或投资额不能负数")
        },
        {
            "code": 10048,
            "msg": gettext("获取交易订单列表失败")
        },
        {
            "code": 10049,
            "msg": gettext("删除提币地址失败")
        },
        {
            "code": 10050,
            "msg": gettext("邮件地址格式错误")
        },
        {
            "code": 10051,
            "msg": gettext("邮件链接已发送，请耐心等待")
        },
        {
            "code": 10052,
            "msg": gettext("邮件地址不能为空")
        },
        {
            "code": 10053,
            "msg": gettext("邮件发送失败")
        },
        {
            "code": 10054,
            "msg": gettext("邮件激活失败")
        },
        {
            "code": 10055,
            "msg": gettext("邮件地址已注册")
        },
        {
            "code": 10056,
            "msg": gettext("修改邮件地址失败")
        },
        {
            "code": 10057,
            "msg": gettext("该手机号码与原手机号码一致，请更换手机号码")
        },
        {
            "code": 10058,
            "msg": gettext("该邮箱与原邮箱地址一致，请更换邮箱地址")
        },
        {
            "code": 10059,
            "msg": gettext("交易密码不能与原交易密码一致")
        },
        {
            "code": 10060,
            "msg": gettext("无法获取ICO订单信息")
        },
        {
            "code": 10061,
            "msg": gettext("真实姓名不能为空")
        },
        {
            "code": 10062,
            "msg": gettext("请上传身份证正面照片")
        },
        {
            "code": 10063,
            "msg": gettext("请上传身份证反面照片")
        },
        {
            "code": 10064,
            "msg": gettext("请上传手持身份证照片")
        },
        {
            "code": 10065,
            "msg": gettext("设置手机号码失败")
        },
        {
            "code": 10066,
            "msg": gettext("用户实名认证提交失败")
        },
        {
            "code": 10067,
            "msg": gettext("用户资料修改失败")
        },
        {
            "code": 10068,
            "msg": gettext("电子邮箱已被绑定")
        },
        {
            "code": 10069,
            "msg": gettext("该花名已被占用，请更换后重新尝试")
        },
        {
            "code": 10070,
            "msg": gettext("自动交款选项设置错误")
        },
        {
            "code": 10071,
            "msg": gettext("充币地址被禁用")
        },
        {
            "code": 10072,
            "msg": gettext("ICO项目已锁定，不允许下单")
        },
        {
            "code": 10073,
            "msg": gettext("今日提币金额已达上限")
        },
        {
            "code": 10074,
            "msg": gettext("当前状态不支持撤单")
        },
        {
            "code": 10075,
            "msg": gettext("交易数量必须大于0.1")
        },
        {
            "code": 10076,
            "msg": gettext("该交易对不存在")
        },
        {
            "code": 10077,
            "msg": gettext("对方账户信息不正确")
        },
        {
            "code": 10078,
            "msg": gettext("转账失败")
        },
        {
            "code": 10079,
            "msg": gettext("不能给自己转账")
        },
        {
            "code": 10080,
            "msg": gettext("对方账户未激活")
        },
        {
            "code": 10081,
            "msg": gettext("转账数量必须大于0")
        },
        {
            "code": 10082,
            "msg": gettext("请先设置交易密码")
        },
        {
            "code": 10083,
            "msg": gettext("不支持的工单类型")
        },
        {
            "code": 10084,
            "msg": gettext("问题描述不能为空")
        },
        {
            "code": 10085,
            "msg": gettext("创建工单失败")
        },
        {
            "code": 10086,
            "msg": gettext("获取工单列表失败")
        },
        {
            "code": 10087,
            "msg": gettext("获取工单详情失败")
        },
        {
            "code": 10088,
            "msg": gettext("获取公告列表失败")
        },
        {
            "code": 10089,
            "msg": gettext("获取公告详情失败")
        },
        {
            "code": 10090,
            "msg": gettext("交易金额必须大于0.000005")
        },
        {
            "code": 10091,
            "msg": gettext("获取BTC/CNY汇率失败")
        },
        {
            "code": 10092,
            "msg": gettext("系统维护中")
        },
        {
            "code": 10093,
            "msg": gettext("API密钥对数量超过上限")
        },
        {
            "code": 10094,
            "msg": gettext("IP地址格式错误")
        },
        {
            "code": 10095,
            "msg": gettext("该API权限不存在")
        },
        {
            "code": 10096,
            "msg": gettext("该API密钥对不存在")
        },
        {
            "code": 10097,
            "msg": gettext("API密钥对描述不能重复")
        },
        {
            "code": 10098,
            "msg": gettext("比特币地址输入不正确")
        },
        {
            "code": 10099,
            "msg": gettext("签名不正确")
        },
        {
            "code": 10100,
            "msg": gettext("领取ULOGOS失败")
        },
        {
            "code": 10101,
            "msg": gettext("比特币区块高度478558快照中不存在该地址")
        },
        {
            "code": 10102,
            "msg": gettext("比特币地址余额不对")
        },
        {
            "code": 10103,
            "msg": gettext("比特币地址余额获取失败")
        },
        {
            "code": 10104,
            "msg": gettext("暂不支持该类型比特币地址领取ULOGOS")
        },
        {
            "code": 10105,
            "msg": gettext("获取账单详情失败")
        },
        {
            "code": 10106,
            "msg": gettext("获取OTC所在地列表失败")
        },
        {
            "code": 10107,
            "msg": gettext("获取OTC列表失败")
        },
        {
            "code": 10108,
            "msg": gettext("删除工单失败")
        },
        {
            "code": 10109,
            "msg": gettext("玩客币地址格式不正确")
        },
        {
            "code": 10110,
            "msg": gettext("充值数量大于1")
        },
        {
            "code": 10111,
            "msg": gettext("尚未进行实名认证")
        },
        {
            "code": 10112,
            "msg": gettext("获取实名认证信息失败")
        },
        {
            "code": 10113,
            "msg": gettext("不支持的证件类型")
        },
        {
            "code": 10114,
            "msg": gettext("API权限ID格式错误")
        },
        {
            "code": 10115,
            "msg": gettext("玩客币地址格式不正确")
        },
        {
            "code": 10116,
            "msg": gettext("玩客币充值数量必须至少为1")
        }
    ],
    "trade_order_direction": [
        {
            "code": 0,
            "name": gettext("买单")
        },
        {
            "code": 1,
            "name": gettext("卖单")
        },
    ],
    "trade_order_direction": [      // 下单方向
        {
            "code": 0,
            "name": gettext("买单")
        },
        {
            "code": 1,
            "name": gettext("卖单")
        },
    ],
    "trade_order_status": [         // 订单状态
        {
            "code": 0,
            "name": gettext("未成交")
        },
        {
            "code": 1,
            "name": gettext("部分成交")
        },
        {
            "code": 2,
            "name": gettext("全部成交")
        },
        {
            "code": 3,
            "name": gettext("正在撤消")
        },
        {
            "code": 4,
            "name": gettext("部分撤消")
        },
        {
            "code": 5,
            "name": gettext("全部撤消")
        },
    ],
    "trade_cancelorder_status": [         // 订单取消的状态
        {
            "code": 0,
            "name": gettext("正在撤消")
        },
        {
            "code": 1,
            "name": gettext("部分成交")
        },
        {
            "code": 2,
            "name": gettext("已撤消")
        },
        {
            "code": 3,
            "name": gettext("无法撤消")
        },
    ],
    "trade_order_type": [         // 订单类型
        {
            "code": 0,
            "name": gettext("普通订单")
        },
        {
            "code": 1,
            "name": gettext("撤消订单")
        },
    ],
    "trade_transaction_direction": [         // 交易方向
        {
            "code": 0,
            "name": gettext("买入")
        },
        {
            "code": 1,
            "name": gettext("卖出")
        },
    ],
    "trade_transaction_status": [         // 交易状态
        {
            "code": 0,
            "name": gettext("已成交")
        },
        {
            "code": 1,
            "name": gettext("已撤消")
        },
        {
            "code": 2,
            "name": gettext("待成交")
        },
    ],
    "icoproject_status": [         // ico 项目状态
        {
            "code": 0,
            "name": gettext("未提交")
        },
        {
            "code": 1,
            "name": gettext("待审核")
        },
        {
            "code": 2,
            "name": gettext("即将开始")
        },
        {
            "code": 3,
            "name": gettext("进行中")
        },
        {
            "code": 4,
            "name": gettext("已锁定")
        },
        {
            "code": 5,
            "name": gettext("已成功")
        },
        {
            "code": 6,
            "name": gettext("失败")
        },
        {
            "code": 7,
            "name": gettext("未通过")
        },
        {
            "code": 8,
            "name": gettext("审核通过")
        },
    ],
    "icoorder_status": [         // ico 订单状态
        {
            "code": 0,
            "name": gettext("已提交")
        },
        {
            "code": 1,
            "name": gettext("已撤销")
        },
        {
            "code": 2,
            "name": gettext("已锁定")
        },
        {
            "code": 3,
            "name": gettext("已中标")
        },
        {
            "code": 4,
            "name": gettext("候补")
        },
        {
            "code": 5,
            "name": gettext("出局")
        },
        {
            "code": 6,
            "name": gettext("待认购")
        },
        {
            "code": 7,
            "name": gettext("弃标")
        },
        {
            "code": 8,
            "name": gettext("已过期")
        },
        {
            "code": 9,
            "name": gettext("认购成功")
        },
    ],
    "charge_direction": [         // 充值提现类型
        {
            "code": 0,
            "name": gettext("充值")
        },
        {
            "code": 1,
            "name": gettext("提现")
        },
    ],
    "charge_status": [         // 充值状态
        {
            "code": 0,
            "name": gettext("确认中")
        },
        {
            "code": 1,
            "name": gettext("已确认")
        },
        {
            "code": 2,
            "name": gettext("已撤销")
        },
    ],
    "wkc_charge_status": [         // WKC 充值状态
        {
            "code": 0,
            "name": gettext("确认中")
        },
        {
            "code": 1,
            "name": gettext("已撤销")
        },
        {
            "code": 2,
            "name": gettext("确认成功")
        },
        {
            "code": 3,
            "name": gettext("确认失败")
        },
    ],
    "withdraw_status": [         // 提现状态
        {
            "code": 10,
            "name": gettext("审核中")
        },
        {
            "code": 11,
            "name": gettext("审核通过")
        },
        {
            "code": 12,
            "name": gettext("审核未通过")
        },
        {
            "code": 13,
            "name": gettext("已汇出")
        },
        {
            "code": 14,
            "name": gettext("已撤销")
        },
    ],
    "frozen_status": [         // 资金冻结状态
        {
            "code": 0,
            "name": gettext("已冻结")
        },
        {
            "code": 1,
            "name": gettext("已解冻")
        },
    ],
    "unfrozen_status": [         // 资金解冻状态
        {
            "code": 0,
            "name": gettext("已解冻")
        },
        {
            "code": 1,
            "name": gettext("已冻结")
        },
    ],
    "transfer_status": [         // 资金过户状态
        {
            "code": 0,
            "name": gettext("已过户")
        },
        {
            "code": 1,
            "name": gettext("已取消")
        },
    ],
    "forward_status": [         // 资金转账状态
        {
            "code": 0,
            "name": gettext("已转账")
        },
        {
            "code": 1,
            "name": gettext("已取消")
        },
    ],
    "dispatch_status": [         // 资金发放状态
        {
            "code": 20,
            "name": gettext("已到账")
        },
        {
            "code": 21,
            "name": gettext("已取消")
        },
    ],
    "fee_status": [         // 手续费状态
        {
            "code": 0,
            "name": gettext("已扣除")
        },
        {
            "code": 1,
            "name": gettext("已取消")
        },
    ],
    "finance_type": [         // 财务记录类型
        {
            "code": 0,
            "id": "charge_status",
            "name": gettext("充值订单")
        },
        {
            "code": 1,
            "id": "withdraw_status",
            "name": gettext("提现订单")
        },
        {
            "code": 2,
            "id": "dispatch_status",
            "name": gettext("资金发放")
        },
        {
            "code": 3,
            "name": gettext("资金过户")
        },
        {
            "code": 4,
            "id": "fee_status",
            "name": gettext("手续费")
        },
        {
            "code": 5,
            "id": "frozen_status",
            "name": gettext("资金冻结")
        },
        {
            "code": 6,
            "id": "unfrozen_status",
            "name": gettext("资金解冻")
        },
        {
            "code": 7,
            "id": "transfer_status",
            "name": gettext("资金转账")
        },
    ],
    "financehistory_type": [         // 财务历史记录类型
        {
            "code": 0,              // 充值订单
            "name": gettext("充值确认中")
        },
        {
            "code": 1,
            "name": gettext("充值已确认")
        },
        {
            "code": 2,
            "name": gettext("充值已取消")
        },
        {
            "code": 10,             // 提现订单
            "name": gettext("提现申请")
        },
        {
            "code": 11,
            "name": gettext("提现审核成功")
        },
        {
            "code": 12,
            "name": gettext("提现审核失败")
        },
        {
            "code": 13,
            "name": gettext("提现已汇出")
        },
        {
            "code": 14,
            "name": gettext("提现取消")
        },
        {
            "code": 20,             // ico订单
            "name": gettext("ICO订单提交")
        },
        {
            "code": 21,
            "name": gettext("ICO订单撤销")
        },
        {
            "code": 22,
            "name": gettext("ICO订单放弃候补")
        },
        {
            "code": 23,
            "name": gettext("ICO订单放弃中标")
        },
        {
            "code": 24,
            "name": gettext("ICO订单认购成功")
        },
        {
            "code": 30,             // 发放订单
            "name": gettext("资金发放")
        },
        {
            "code": 31,
            "name": gettext("资金发放取消")
        },
        {
            "code": 32,
            "name": gettext("ulogos清退")
        },
        {
            "code": 40,             // 交易订单
            "name": gettext("交易订单提交")
        },
        {
            "code": 41,
            "name": gettext("交易订单撤消")
        },
        {
            "code": 42,
            "name": gettext("交易订单返还")
        },
        {
            "code": 43,
            "name": gettext("交易订单收入")
        },
        {
            "code": 44,
            "name": gettext("交易订单支出")
        },
        {
            "code": 70,             // 转账订单
            "name": gettext("转账收入")
        },
        {
            "code": 71,
            "name": gettext("转账支出")
        },
        {
            "code": 72,
            "name": gettext("转账收入取消")
        },
        {
            "code": 73,
            "name": gettext("转账支出取消")
        },
    ],
    "financehistory_reason": [
        {
            "code": 0,
            "reason": gettext("充值已确认")
        },
        {
            "code": 1,
            "reason": gettext("充值已取消")
        },
        {
            "code": 2,
            "reason": gettext("充值确认中")
        },
        {
            "code": 3,
            "reason": gettext("提现取消")
        },
        {
            "code": 4,
            "reason": gettext("提现审核失败")
        },
        {
            "code": 5,
            "reason": gettext("提现申请")
        },
        {
            "code": 6,
            "reason": gettext("转账支出取消")
        },
        {
            "code": 7,
            "reason": gettext("转账收入取消")
        },
        {
            "code": 8,
            "reason": gettext("转账支出")
        },
        {
            "code": 9,
            "reason": gettext("转账收入")
        },
        {
            "code": 10,
            "reason": gettext("资金发放取消")
        },
        {
            "code": 11,
            "reason": gettext("资金发放")
        }
    ],
    "question_status": [        // 工单处理状态
        {
            "code": 0,
            "name": gettext("待处理")
        },
        {
            "code": 1,
            "name": gettext("已处理")
        },
    ],
    "question_type": [        // 工单问题类型
        {
            "code": 0,
            "name": gettext("充值")
        },
        {
            "code": 1,
            "name": gettext("提现")
        },
        {
            "code": 2,
            "name": gettext("账户")
        },
        {
            "code": 3,
            "name": gettext("转账")
        },
        {
            "code": 4,
            "name": gettext("其它")
        },
    ],
    "notice_status": [        // 公告状态
        {
            "code": 0,
            "name": gettext("未激活")
        },
        {
            "code": 1,
            "name": gettext("已激活")
        },
    ],
    "message_type": [        // 站内消息类型
        {
            "code": 0,
            "name": gettext("通知")
        },
        {
            "code": 1,
            "name": gettext("活动")
        },
        {
            "code": 2,
            "name": gettext("其它")
        },
    ],
    "notice_type": [        // 公告类型
        {
            "code": 0,
            "name": gettext("官方公告")
        },
        {
            "code": 1,
            "name": gettext("论证公告")
        },
        {
            "code": 2,
            "name": gettext("停牌公告")
        },
    ],
    "auth_type": [
        {
            "code": 0,
            "name": gettext("bitbiex交易所股东")
        }
    ]
}