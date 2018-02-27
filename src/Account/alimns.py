# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json
import logging
import uuid

from aliyunsdkcore.client import AcsClient
from aliyunsdkdysmsapi.request.v20170525 import SendSmsRequest

from django.conf import settings

logger = logging.getLogger(__name__)

"""
短信发送频率限制

短信验证码：使用同一签名，对同一手机号码发送短信验证码，1条／分钟，5条／小时。10条／天
短信通知：使用同一签名和同一短信模版ID，对同一手机号码发送短信通知，支持50条／日

注：
从第一次请求接口时，阿里云已经启动了频率控制策略，不论请求是否成功

频率报错信息：Frequency limit reaches
"""


# 请参考本文档步骤2
# SMS_78715112 尊敬的用户：您的验证码是${code}，5分钟有效，请勿将验证码泄露于他人。
# SMS_82035083 您的${amount}已处理。
# SMS_82135097 您的账户${code}转账${amount}已处理。
# SMS_82025095 您的比特币账户提现${amount}已处理。

def send_sms(phone_number, templateCode, dic_template_param=None, **kwargs):
    try:
        REGION = settings.ACCOUNT_SMS_REGION
        # ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
        ACCESS_KEY_ID = settings.ACCOUNT_ACCID
        ACCESS_KEY_SECRET = settings.ACCOUNT_ACCKEY
        ACCOUNT_SIGN_NAME = settings.ACCOUNT_SIGN_NAME
        # ACCOUNT_TEMPLATE_CODE = settings.ACCOUNT_TEMPLATE_CODE
        ACCOUNT_TEMPLATE_CODE = templateCode

        acs_client = AcsClient(ACCESS_KEY_ID, ACCESS_KEY_SECRET, REGION)

        __business_id = uuid.uuid1()

        smsRequest = SendSmsRequest.SendSmsRequest()
        # 申请的短信模板编码,必填
        smsRequest.set_TemplateCode(ACCOUNT_TEMPLATE_CODE)
        # 短信模板变量参数
        if dic_template_param is not None:
            template_param = json.dumps(dic_template_param)
            smsRequest.set_TemplateParam(template_param)
        # 设置业务请求流水号，必填。
        smsRequest.set_OutId(__business_id)
        # 短信签名
        smsRequest.set_SignName(ACCOUNT_SIGN_NAME)
        # 短信发送的号码，必填。支持以逗号分隔的形式进行批量调用，批量上限为1000个手机号码,批量调用相对于单条调用及时性稍有延迟,验证码类型的短信推荐使用单条调用的方式
        smsRequest.set_PhoneNumbers(str(phone_number.national_number))
        # 发送请求
        result = acs_client.do_action_with_exception(smsRequest)
        dic_result = json.loads(result)
        result_code = dic_result.get('Code')
        result_msg = dic_result.get('Message')
        if result_code == 'OK':
            logger.info('Message publish succeed.')
            return {'result': 1, 'msg': '短信发送成功', 'data': result_msg}
        elif result_code == 'isv.BUSINESS_LIMIT_CONTROL':
            logger.error('Message max num limited for [%s].' % str(phone_number.national_number))
            return {'result': 2, 'msg': '短信发送请求过于频繁，请稍后再试', 'data': ''}
        else:
            logger.error('%s [%s]' % (result_msg, str(phone_number.national_number)))
            return {'result': False, 'msg': result_msg, 'data': ''}
    except Exception as e:
        logger.error(e)
        return {'result': False, 'msg': 'exception', 'data': e}


# def send_sms(receiver, params, *args, **kwargs):
#     accid = kwargs.get('accid', settings.ACCOUNT_ACCID)
#     acckey = kwargs.get('acckey', settings.ACCOUNT_ACCKEY)
#     endpoint = kwargs.get('endpoint', settings.ACCOUNT_ENDPOINT)
#     token = kwargs.get('token', settings.ACCOUNT_TOKEN)
#     topic_name = kwargs.get('topic', settings.ACCOUNT_TOPIC_NAME)
#
#     ali_account = Account(endpoint, accid, acckey, token)
#     ali_topic = ali_account.get_topic(topic_name)
#
#     sign_name = kwargs.get('sign_name', settings.ACCOUNT_SIGN_NAME)
#     template_code = kwargs.get('template_code', settings.ACCOUNT_TEMPLATE_CODE)
#
#     direct_sms_attr = DirectSMSInfo(free_sign_name=sign_name, template_code=template_code, single=False)
#
#     # TODO 目前只支持中国大陆手机
#     direct_sms_attr.add_receiver(receiver=str(receiver.national_number), params=params)
#
#     msg_body = "sms-message."
#     msg = TopicMessage(msg_body, direct_sms=direct_sms_attr)
#
#     try:
#         re_msg = ali_topic.publish_message(msg)
#         logger.info("Publish Message Succeed. PhoneNumber:%s MessageBody:%s MessageID:%s" % (receiver.as_e164, msg_body, re_msg.message_id))
#     except MNSExceptionBase as e:
#         if e.type == "TopicNotExist":
#             logger.error("Topic not exist, please create it.")
#         logger.warning("Publish Message Fail. Exception:%s" % e)
#         raise MNSExceptionBas

if __name__ == "__main__":
    params = {'code': '54321'}
    r = send_sms("18516090817", params)
    print r
