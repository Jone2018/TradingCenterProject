from collections import OrderedDict

from django.contrib.auth import get_user_model
from rest_framework import serializers

from Dic.models import CoinType
from OTC.models import Advertise, Ticket

User = get_user_model()


class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("uid", "username", "is_realname_verified")


class CoinTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoinType
        fields = ['name', 'no']


class ChoicesField(serializers.Field):
    """Custom ChoiceField serializer field."""

    def __init__(self, choices, **kwargs):
        """init."""
        self._choices = OrderedDict(choices)
        super(ChoicesField, self).__init__(**kwargs)

    def to_representation(self, obj):
        """Used while retrieving value for the field."""
        return self._choices[obj]

    def to_internal_value(self, data):
        """Used while storing value for the field."""
        for i in self._choices:
            if self._choices[i] == data:
                return i
        raise serializers.ValidationError("Acceptable values are {0}.".format(list(self._choices.values())))


class AdvertiseSerializer(serializers.ModelSerializer):
    # direction = ChoicesField(DIRECTION_CHOICES)
    # country = ChoicesField(COUNTRY_CHOICES)
    # payment = ChoicesField(PAYMENT_CHOICES)
    # status = ChoicesField(ADVERTISE_STATUS_CHOICES)
    user = UserDetailSerializer(read_only=True)

    def validate(self, attrs):
        if attrs.get("min_limit") > attrs.get("max_limit"):
            raise serializers.ValidationError('Min Limit Greater Than Max Limit.')
        return attrs

    class Meta:
        model = Advertise
        fields = '__all__'
        read_only_fields = ('pk', 'status',)


class TicketSerializer(serializers.ModelSerializer):
    user = UserDetailSerializer(read_only=True)

    # target = AdvertiseSerializer(read_only=True)

    expire_time = serializers.DateTimeField(read_only=True)

    def validate(self, attrs):
        # if attrs.get("min_limit") > attrs.get("max_limit"):
        #     raise serializers.ValidationError('Min Limit Greater Than Max Limit.')
        return attrs

    class Meta:
        model = Ticket
        fields = '__all__'
        read_only_fields = ('pk', 'status',)
