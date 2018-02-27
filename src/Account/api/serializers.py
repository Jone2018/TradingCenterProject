# -*- encoding: utf-8 -*-

from rest_framework import serializers

from ..models import (
    User, Group
)


class UserSerializer(serializers.ModelSerializer):
    # url = serializers.HyperlinkedIdentityField(view_name="api_account:user-detail")

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'nickname', 'phone', 'email')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')
