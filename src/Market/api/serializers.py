# -*- encoding: utf-8 -*-
from rest_framework import serializers
# from .models import MarketInfo
#
#
# class _MarketInfoSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = MarketInfo
#         fields = [
#             'pair_id',
#             'direction',
#             'price',
#         ]
#
#
# class MarketInfoSerializer(serializers.Serializer):
#     pair_id = serializers.IntegerField(label='交易对编码', default=1)
#     direction = serializers.IntegerField(label='下单方向', default=0)
#     price = serializers.CharField(label='价格')
#     quantity = serializers.DecimalField(label='数量', max_digits=30, decimal_places=8)
#     is_new = serializers.IntegerField(label='是否为新数据', default=0)
