from __future__ import unicode_literals

from django.contrib.auth.backends import ModelBackend

from .models import User


class PhonenumberAuthenticationBackend(ModelBackend):

    def authenticate(self, **credentials):
        try:
            lookup_kwargs = {
                "phone_number__iexact": credentials["phone_number"],
                "is_phone_verified": True
            }
            user = User.objects.get(**lookup_kwargs)
        except (User.DoesNotExist, KeyError):
            return None
        else:
            try:
                if user.check_password(credentials["password"]):
                    return user
            except KeyError:
                return None


class EmailAuthenticationBackend(ModelBackend):

    def authenticate(self, **credentials):
        try:
            lookup_kwargs = {
                "email__iexact": credentials["email"],
                "is_email_verified": True
            }
            user = User.objects.get(**lookup_kwargs)
        except (User.DoesNotExist, KeyError):
            return None
        else:
            try:
                if user.check_password(credentials["password"]):
                    return user
            except KeyError:
                return None
