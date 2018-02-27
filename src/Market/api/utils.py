# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from Dic.models import PairChoices


def get_pair_id(symbol):
    if symbol == 'ulogos_btc':
        pair_code = 1
    elif symbol == 'bitcoinlogo_btc':
        pair_code = 2
    else:
        raise Exception

    return pair_code
    # pair = PairChoices.objects.get(code=pair_code)
    # return pair.id

