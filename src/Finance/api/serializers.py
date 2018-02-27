# -*- encoding: utf-8 -*-

from rest_framework import serializers

from ..models import (
    Funds, CNY, BTC, ETC, ETH,
    FrozenFund, UnfrozenFund, TransferFund
)


class CNYSerializer(serializers.ModelSerializer):
    class Meta:
        model = CNY
        fields = ('available', 'frozen')


class BTCSerializer(serializers.ModelSerializer):
    class Meta:
        model = BTC
        fields = ('available', 'frozen')


class ETCSerializer(serializers.ModelSerializer):
    class Meta:
        model = ETC
        fields = ('available', 'frozen')


class ETHSerializer(serializers.ModelSerializer):
    class Meta:
        model = ETH
        fields = ('available', 'frozen')


class FundsSerializer(serializers.ModelSerializer):
    cny = CNYSerializer()
    btc = BTCSerializer()
    etc = ETCSerializer()
    eth = ETHSerializer()

    class Meta:
        model = Funds
        fields = ('user', 'net_asset', 'total_asset', 'cny', 'btc', 'etc', 'eth')


class FrozenFundSerializer(serializers.ModelSerializer):
    class Meta:
        model = FrozenFund
        fields = '__all__'


class UnfrozenFundSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnfrozenFund
        fields = '__all__'


class TransferFundSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransferFund
        fields = '__all__'
