# -*- coding: utf-8 -*-
from bitcoin.signmessage import BitcoinMessage, VerifyMessage
from django.conf import settings
from pybitcointools import (
    get_pubkey_format, encode_pubkey, decode_pubkey,
    get_privkey_format, encode_privkey, decode_privkey,
    fast_multiply, fast_add,
    b58check_to_hex, pubkey_to_address, N
)

try:
    from Crypto.Hash import keccak

    sha3_256 = lambda x: keccak.new(digest_bits=256, data=x).digest()
except ImportError:
    try:
        import sha3 as _sha3

        sha3_256 = lambda x: _sha3.keccak_256(x).digest()
    except ImportError:
        from _pysha3 import keccak_256

        sha3_256 = lambda x: keccak_256(x).digest()


# 校验签名
def verify_signature(address, signature, message='Send Ulogos to Suiqiu'):
    msg = BitcoinMessage(message)
    return VerifyMessage(address, msg, signature)


# 计算公钥p1+n*p2
def multiply_pubkeys(p1, p2, n):
    f1, f2 = get_pubkey_format(p1), get_pubkey_format(p2)
    mp = fast_multiply(decode_pubkey(p2, f2), n)
    return encode_pubkey(fast_add(decode_pubkey(p1, f1), mp), f1)


# 计算私钥p1+n*p2
def multiply_privkeys(p1, p2, n):
    f1, f2 = get_privkey_format(p1), get_privkey_format(p2)
    p = decode_privkey(p1, f1)
    while n > 0:
        p = (p + decode_privkey(p2, f2)) % N
        n -= 1
    return encode_privkey(p, f1)


# 获取用户地址，私钥对应格式为wif_compressed
def get_user_address(step, basepub, steppub, magic=None):
    basepub = b58check_to_hex(basepub)
    steppub = b58check_to_hex(steppub)
    pubkey = multiply_pubkeys(basepub, steppub, step)

    address = pubkey_to_address(pubkey) if magic is None else pubkey_to_address(pubkey, magic)
    return address


# 获取用户的比特币地址
def get_btc_address(step):
    basepub = settings.BTC_BASEPUB
    steppub = settings.BTC_STEPPUB
    return get_user_address(step, basepub, steppub)


# 公钥转成ETH地址
def pubkey_to_ethaddress(pubkey):
    pub = encode_pubkey(pubkey, 'bin')
    address = sha3_256(pub[1:])[12:]
    return '0x' + address.encode('hex')


# 获取ETH地址
def get_eth_address(step):
    basepub = b58check_to_hex(settings.ETH_BASEPUB)
    steppub = b58check_to_hex(settings.ETH_STEPPUB)
    pubkey = multiply_pubkeys(basepub, steppub, step)
    address = pubkey_to_ethaddress(pubkey)
    return address


# 获取SNGLS地址
def get_sngls_address(step):
    basepub = b58check_to_hex(settings.SNGLS_BASEPUB)
    steppub = b58check_to_hex(settings.SNGLS_STEPPUB)
    pubkey = multiply_pubkeys(basepub, steppub, step)
    address = pubkey_to_ethaddress(pubkey)
    return address


# 获取MKR地址
def get_mkr_address(step):
    basepub = b58check_to_hex(settings.MKR_BASEPUB)
    steppub = b58check_to_hex(settings.MKR_STEPPUB)
    pubkey = multiply_pubkeys(basepub, steppub, step)
    address = pubkey_to_ethaddress(pubkey)
    return address


# 获取BCAP地址
def get_bcap_address(step):
    basepub = b58check_to_hex(settings.BCAP_BASEPUB)
    steppub = b58check_to_hex(settings.BCAP_STEPPUB)
    pubkey = multiply_pubkeys(basepub, steppub, step)
    address = pubkey_to_ethaddress(pubkey)
    return address


def get_agrs_address(step):
    basepub = settings.AGRS_BASEPUB
    steppub = settings.AGRS_STEPPUB
    return get_user_address(step, basepub, steppub)


# 获取用户的XPM地址
def get_xpm_address(step):
    basepub = settings.XPM_BASEPUB
    steppub = settings.XPM_STEPPUB
    return get_user_address(step, basepub, steppub, 23)


# 获取用户的BCC地址
def get_bcc_address(step):
    basepub = settings.BCC_BASEPUB
    steppub = settings.BCC_STEPPUB
    return get_user_address(step, basepub, steppub)


# 获取ETC地址
def get_etc_address(step):
    basepub = b58check_to_hex(settings.ETC_BASEPUB)
    steppub = b58check_to_hex(settings.ETC_STEPPUB)
    pubkey = multiply_pubkeys(basepub, steppub, step)
    address = pubkey_to_ethaddress(pubkey)
    return address


# 获取ETC地址
def get_tel_address(step):
    basepub = b58check_to_hex(settings.TEL_BASEPUB)
    steppub = b58check_to_hex(settings.TEL_STEPPUB)
    pubkey = multiply_pubkeys(basepub, steppub, step)
    address = pubkey_to_ethaddress(pubkey)
    return address
