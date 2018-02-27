# from rest_framework_httpsignature.authentication import SignatureAuthentication
# from Account.models import APISecret
#
#
# class MyAPISignatureAuthentication(SignatureAuthentication):
#
#     API_KEY_HEADER = 'X-API-Key'
#     ALGORITHM = 'hmac-sha256'
#
#     def fetch_user_data(self, api_key):
#         try:
#             print api_key
#             target_key_pair = APISecret.objects.get(api_key=api_key)
#             return target_key_pair.user, target_key_pair.api_secret
#         except APISecret.DoesNotExist:
#             return None
