# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.auth.signals import user_logged_in
from django.db.models.signals import post_save
from django.dispatch import receiver
from social_django.models import UserSocialAuth

from .models import User, Profile, LoginHistory


@receiver(post_save, sender=User)
def user_post_save(sender, **kwargs):
    # Disable post_save during manage.py loaddata
    if kwargs.get("raw", False):
        return False

    user, created = kwargs["instance"], kwargs["created"]
    if not isinstance(user, User):
        return
    if created:
        Profile.objects.create(user=user, nickname=user.username)


@receiver(user_logged_in)
def update_last_login(sender, request, user, **kwargs):
    if not isinstance(user, User):
        return

    user.last_login_ip = request.META.get("REMOTE_ADDR", "127.0.0.1")
    user.save(update_fields=['last_login_ip'])

    try:
        qqsocial = UserSocialAuth.objects.get(user=user, provider='qq')
        profile = Profile.objects.get(user=user)
        profile.nickname = qqsocial.extra_data['username']
        profile.avatar = qqsocial.extra_data['profile_image_url'].replace('http://', 'https://')
        profile.save()
    except UserSocialAuth.DoesNotExist:
        pass

    LoginHistory.objects.create(user=user, login_ip=user.last_login_ip)
