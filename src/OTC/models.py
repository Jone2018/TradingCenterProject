# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import datetime
import logging

from django.conf import settings
from django.db import models

from Dic.models import CoinType

logger = logging.getLogger(__name__)

DIRECTION_CHOICES = (
    (0, "买"),
    (1, "卖"),
)

COUNTRY_CHOICES = (
    ("AO", "AO  安哥拉"),
    ("AF", "AF  阿富汗"),
    ("AL", "AL  阿尔巴尼亚"),
    ("DZ", "DZ  阿尔及利亚"),
    ("AD", "AD  安道尔共和国"),
    ("AI", "AI  安圭拉岛"),
    ("AG", "AG  安提瓜和巴布达"),
    ("AR", "AR  阿根廷"),
    ("AM", "AM  亚美尼亚"),
    ("AU", "AU  澳大利亚"),
    ("AT", "AT  奥地利"),
    ("AZ", "AZ  阿塞拜疆"),
    ("BS", "BS  巴哈马"),
    ("BH", "BH  巴林"),
    ("BD", "BD  孟加拉国"),
    ("BB", "BB  巴巴多斯"),
    ("BY", "BY  白俄罗斯"),
    ("BE", "BE  比利时"),
    ("BZ", "BZ  伯利兹"),
    ("BJ", "BJ  贝宁"),
    ("BM", "BM  百慕大群岛"),
    ("BO", "BO  玻利维亚"),
    ("BW", "BW  博茨瓦纳"),
    ("BR", "BR  巴西"),
    ("BN", "BN  文莱"),
    ("BG", "BG  保加利亚"),
    ("BF", "BF  布基纳法索"),
    ("MM", "MM  缅甸"),
    ("BI", "BI  布隆迪"),
    ("CM", "CM  喀麦隆"),
    ("CA", "CA  加拿大"),
    ("CF", "CF  中非共和国"),
    ("TD", "TD  乍得"),
    ("CL", "CL  智利"),
    ("CG", "CG  刚果"),
    ("CK", "CK  库克群岛"),
    ("CR", "CR  哥斯达黎加"),
    ("CU", "CU  古巴"),
    ("CN", "CN  中国"),
    ("CY", "CY  塞浦路斯"),
    ("CZ", "CZ  捷克"),
    ("DK", "DK  丹麦"),
    ("DJ", "DJ  吉布提"),
    ("DO", "DO  多米尼加共和国"),
    ("EC", "EC  厄瓜多尔"),
    ("EG", "EG  埃及"),
    ("SV", "SV  萨尔瓦多"),
    ("EE", "EE  爱沙尼亚"),
    ("ET", "ET  埃塞俄比亚"),
    ("FJ", "FJ  斐济"),
    ("FI", "FI  芬兰"),
    ("FR", "FR  法国"),
    ("GF", "GF  法属圭亚那"),
    ("GA", "GA  加蓬"),
    ("GM", "GM  冈比亚"),
    ("GE", "GE  格鲁吉亚"),
    ("DE", "DE  德国"),
    ("GH", "GH  加纳"),
    ("GI", "GI  直布罗陀"),
    ("GR", "GR  希腊"),
    ("GD", "GD  格林纳达"),
    ("GU", "GU  关岛"),
    ("GT", "GT  危地马拉"),
    ("GN", "GN  几内亚"),
    ("GY", "GY  圭亚那"),
    ("HT", "HT  海地"),
    ("HN", "HN  洪都拉斯"),
    ("HK", "HK  中国香港"),
    ("HU", "HU  匈牙利"),
    ("IS", "IS  冰岛"),
    ("IN", "IN  印度"),
    ("ID", "ID  印度尼西亚"),
    ("IR", "IR  伊朗"),
    ("IQ", "IQ  伊拉克"),
    ("IE", "IE  爱尔兰"),
    ("IL", "IL  以色列"),
    ("IT", "IT  意大利"),
    ("JM", "JM  牙买加"),
    ("JP", "JP  日本"),
    ("JO", "JO  约旦"),
    ("KH", "KH  柬埔寨"),
    ("KZ", "KZ  哈萨克斯坦"),
    ("KE", "KE  肯尼亚"),
    ("KR", "KR  韩国"),
    ("KW", "KW  科威特"),
    ("KG", "KG  吉尔吉斯坦"),
    ("LA", "LA  老挝"),
    ("LV", "LV  拉脱维亚"),
    ("LB", "LB  黎巴嫩"),
    ("LS", "LS  莱索托"),
    ("LR", "LR  利比里亚"),
    ("LY", "LY  利比亚"),
    ("LI", "LI  列支敦士登"),
    ("LT", "LT  立陶宛"),
    ("LU", "LU  卢森堡"),
    ("MO", "MO  中国澳门"),
    ("MG", "MG  马达加斯加"),
    ("MW", "MW  马拉维"),
    ("MY", "MY  马来西亚"),
    ("MV", "MV  马尔代夫"),
    ("ML", "ML  马里"),
    ("MT", "MT  马耳他"),
    ("MU", "MU  毛里求斯"),
    ("MX", "MX  墨西哥"),
    ("MD", "MD  摩尔多瓦"),
    ("MC", "MC  摩纳哥"),
    ("MN", "MN  蒙古"),
    ("MS", "MS  蒙特塞拉特岛"),
    ("MA", "MA  摩洛哥"),
    ("MZ", "MZ  莫桑比克"),
    ("NA", "NA  纳米比亚"),
    ("NR", "NR  瑙鲁"),
    ("NP", "NP  尼泊尔"),
    ("NL", "NL  荷兰"),
    ("NZ", "NZ  新西兰"),
    ("NI", "NI  尼加拉瓜"),
    ("NE", "NE  尼日尔"),
    ("NG", "NG  尼日利亚"),
    ("KP", "KP  朝鲜"),
    ("NO", "NO  挪威"),
    ("OM", "OM  阿曼"),
    ("PK", "PK  巴基斯坦"),
    ("PA", "PA  巴拿马"),
    ("PG", "PG  巴布亚新几内亚"),
    ("PY", "PY  巴拉圭"),
    ("PE", "PE  秘鲁"),
    ("PH", "PH  菲律宾"),
    ("PL", "PL  波兰"),
    ("PF", "PF  法属玻利尼西亚"),
    ("PT", "PT  葡萄牙"),
    ("PR", "PR  波多黎各"),
    ("QA", "QA  卡塔尔"),
    ("RO", "RO  罗马尼亚"),
    ("RU", "RU  俄罗斯"),
    ("LC", "LC  圣卢西亚"),
    ("VC", "VC  圣文森特岛"),
    ("SM", "SM  圣马力诺"),
    ("ST", "ST  圣多美和普林西比"),
    ("SA", "SA  沙特阿拉伯"),
    ("SN", "SN  塞内加尔"),
    ("SC", "SC  塞舌尔"),
    ("SL", "SL  Leone"),
    ("SG", "SG  新加坡"),
    ("SK", "SK  斯洛伐克"),
    ("SI", "SI  斯洛文尼亚"),
    ("SB", "SB  所罗门群岛"),
    ("SO", "SO  索马里"),
    ("ZA", "ZA  南非"),
    ("ES", "ES  西班牙"),
    ("LK", "LK  斯里兰卡"),
    ("LC", "LC  圣卢西亚"),
    ("VC", "VC  圣文森特"),
    ("SD", "SD  苏丹"),
    ("SR", "SR  苏里南"),
    ("SZ", "SZ  斯威士兰"),
    ("SE", "SE  瑞典"),
    ("CH", "CH  瑞士"),
    ("SY", "SY  叙利亚"),
    ("TW", "TW  中国台湾"),
    ("TJ", "TJ  塔吉克斯坦"),
    ("TZ", "TZ  坦桑尼亚"),
    ("TH", "TH  泰国"),
    ("TG", "TG  多哥"),
    ("TO", "TO  汤加"),
    ("TT", "TT  特立尼达和多巴哥"),
    ("TN", "TN  突尼斯"),
    ("TR", "TR  土耳其"),
    ("TM", "TM  土库曼斯坦"),
    ("UG", "UG  乌干达"),
    ("UA", "UA  乌克兰"),
    ("AE", "AE  阿拉伯联合酋长国"),
    ("GB", "GB  英国"),
    ("US", "US  美国"),
    ("UY", "UY  乌拉圭"),
    ("UZ", "UZ  乌兹别克斯坦"),
    ("VE", "VE  委内瑞拉"),
    ("VN", "VN  越南"),
    ("YE", "YE  也门"),
    ("YU", "YU  南斯拉夫"),
    ("ZW", "ZW  津巴布韦"),
    ("ZR", "ZR  扎伊尔"),
    ("ZM", "ZM  赞比亚"),
)

PAYMENT_CHOICES = (
    (0, "现金存款"),
    (1, "银行转账"),
    (2, "支付宝"),
    (3, "微信支付"),
    (4, "iTunes礼品卡"),
    (5, "PayPal"),
    (6, "西联汇款"),
    (7, "MoneyGram"),
    (8, "Perfect Money"),
    (9, "Paytm"),
    (10, "Kakao"),
    (11, "其它"),
)

ADVERTISE_STATUS_CHOICES = (
    # (0, ""),
    (1, "正常"),
    (2, "关闭"),
    (3, "管理员关闭"),
)

DEFAULT_ADV_COMMENT = "No Comment Yet."

TicketValidTime = datetime.timedelta(minutes=30)


# Create your models here.
class Advertise(models.Model):
    coin = models.ForeignKey(CoinType, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    direction = models.PositiveSmallIntegerField(choices=DIRECTION_CHOICES)
    country = models.CharField(max_length=4, choices=COUNTRY_CHOICES, default="CN", blank=False)
    margin = models.FloatField(max_length=4)  # 溢价 用于计算Price  => margin % * Currency Price
    gap = models.DecimalField(decimal_places=2, max_digits=7)  # 买单广告对应最高成交价，卖单反之
    min_limit = models.DecimalField(decimal_places=2, max_digits=7)
    max_limit = models.DecimalField(decimal_places=2, max_digits=7)
    payment = models.PositiveSmallIntegerField(choices=PAYMENT_CHOICES)
    create_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)
    comment = models.TextField(default=DEFAULT_ADV_COMMENT)
    authenticated_user_only = models.BooleanField(default=False, blank=False, null=False)

    pay_time_limit = models.IntegerField(default=30, editable=False)

    status = models.PositiveSmallIntegerField(default=1, choices=ADVERTISE_STATUS_CHOICES)

    @classmethod
    def get_valid_advertises(cls):
        return cls.objects.filter(status=1)

    def deactivate(self):
        self.status = 2
        self.save(update_fields=["status"])

    def __unicode__(self):
        return "[ID: {}] Direction: {}, Country: {}".format(self.pk, self.get_direction_display(),
                                                            self.get_country_display() if self.get_country_display() else "No Country Specified")


TICKET_STATUS_CHOICES = (
    (0, "正常"),
    (1, "买家已付款"),
    (2, "已关闭"),
    (5, "交易过时，系统关闭"),
    (6, "管理员关闭"),
)


class Ticket(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    status = models.PositiveSmallIntegerField(default=0, choices=TICKET_STATUS_CHOICES)

    price_base = models.DecimalField(decimal_places=2, max_digits=10)  # 法币计价  千万级别，精确到分
    price_currency = models.DecimalField(decimal_places=8, max_digits=13)  # 虚拟货币计价  万级别，精确到8位

    target = models.ForeignKey(Advertise, on_delete=models.CASCADE)

    create_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)
    expire_time = models.DateTimeField(default=datetime.datetime.now() + TicketValidTime, blank=False, null=False)

    @classmethod
    def get_valid_tickets(cls):
        """
        获取在有效时间之内的订单  create_time + pay_time_limit > now  <-- valid
        同时将过时的订单切换为状态5  # remove_expired
        """
        now = datetime.datetime.now()
        return cls.objects.filter(expire_time__gte=now)

    @classmethod
    def remove_expired(cls):
        now = datetime.datetime.now()
        expired_tickets = cls.objects.filter(expire_time__lt=now, status=0)
        r = expired_tickets.update(status=5)
        logger.info("{} tickets expired, thus make as expired.".format(r))

    @property
    def is_valid(self):
        target = self.target
        pay_time_limit = target.pay_time_limit
        return self.create_time + datetime.timedelta(minutes=pay_time_limit) > datetime.datetime.now()

    def owner_delete(self):
        self.status = 2
        self.save(update_fields=["status"])

    def deactivate(self):
        self.status = 6
        self.save(update_fields=["status"])
