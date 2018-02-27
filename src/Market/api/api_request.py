import hashlib
import base64
import requests

from hmac import HMAC

import six
from httpsig.requests_auth import HTTPSignatureAuth

"""
~$ SSS=Base64(Hmac(SECRET, "Date: Mon, 17 Feb 2014 06:11:05 GMT", SHA256))
~$ curl -v -H 'Date: "Mon, 17 Feb 2014 06:11:05 GMT"' -H 'Authorization: Signature keyId="my-key",algorithm="hmac-sha256",headers="date",signature="SSS"'
"""

required_headers = ['X-API-Key', 'Date']

API_KEY = '1643be502f4c9ca7887a60f260325ed04174095fba4fec49e83ad857b54fdeca'
API_SECRET = '3e5b828fe798384d2b7885680e257733499b84716814b2549183ca92cd29e40e'

URL = 'http://127.0.0.1:8001/api/v1/depth/?symbol=10000'


class CaseInsensitiveDict(dict):
    def __init__(self, d=None, **kwargs):
        super(CaseInsensitiveDict, self).__init__(**kwargs)
        if d:
            self.update((k.lower(), v) for k, v in six.iteritems(d))

    def __setitem__(self, key, value):
        super(CaseInsensitiveDict, self).__setitem__(key.lower(), value)

    def __getitem__(self, key):
        return super(CaseInsensitiveDict, self).__getitem__(key.lower())

    def __contains__(self, key):
        return super(CaseInsensitiveDict, self).__contains__(key.lower())


def _sign_hmac(secret, data):
    return HMAC(secret, data, hashlib.sha256).digest()


def _get_signable(headers_required, headers):
    if not isinstance(headers, dict):
        raise Exception('headers must be a dict type...')
    headers = CaseInsensitiveDict(headers)
    signable_list = []
    for h in headers_required:
        h = h.lower()
        if h not in headers:
            raise Exception('missing required header <%s>...' % h)
        signable_list.append('%s: %s' % (h, headers[h]))
    return '\n'.join(signable_list)


def _sign(secret, headers):
    signable = _get_signable(required_headers, headers)
    signed = _sign_hmac(secret, signable)
    return base64.b64encode(signed).decode("ascii")


def http(url, api_key, signed):
    headers = {
        'X-API-Key': api_key,
        'Date': "Mon, 17 Feb 2014 06:11:05 GMT",
        'Authorization': "Signature headers=\"x-api-key date\",keyId=\"\",algorithm=\"hmac-sha256\",signature=\"{signature}\"".format(
            signature=signed)
    }
    response = requests.get(url, headers=headers)
    print response.request.headers.get('Authorization')
    return response.text


def main():
    print 'Using HTTPSig Library...'
    headers = {
        'X-API-Key': API_KEY,
        'Date': 'Mon, 17 Feb 2014 06:11:05 GMT'
    }
    auth = HTTPSignatureAuth(secret=API_SECRET, algorithm='hmac-sha256', headers=headers)

    response = requests.get(URL, auth=auth, headers=headers)
    print response.request.headers.get('Authorization')
    print response.text

    print '---' * 20

    print 'Using self sign method...'
    headers = {
        'X-API-Key': API_KEY,
        'Date': 'Mon, 17 Feb 2014 06:11:05 GMT'
    }

    sign = _sign(API_SECRET, headers)
    text = http(URL, API_KEY, sign)
    print text


if __name__ == '__main__':
    main()
