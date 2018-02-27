# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import time
from datetime import datetime
from random import randint

from purifier.purifier import HTMLPurifier

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


def xss_filter(str, pattern=dict()):
    '''
    使用html-purifier模块防止xss注入
    :param str: 待处理的字符串
    :param pattern: 过滤模式，详细见https://github.com/PixxxeL/python-html-purifier
    :return: 过滤之后的字符串
    '''
    purifier = HTMLPurifier(pattern)
    return purifier.feed(str)
