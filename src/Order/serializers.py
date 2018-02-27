# -*- encoding: utf-8 -*-
from rest_framework import serializers
from Order.models import Order, CancelOrder


class OrderSerializer(serializers.ModelSerializer):
    order_id = serializers.ReadOnlyField(source='id')
    class Meta:
        model = Order
        fields = ('order_id', 'user_id', 'pair_id', 'price', 'quantity', 'create_time', 'direction', 'action',
                  'auto_cancel', 'valid_time', 'fee_type', 'fee', 'status', 'dealed', 'canceled', 'order_type',
                  'frozen', 'transfer')


class CancelOrderSerializer(serializers.ModelSerializer):
    cancelorder_id = serializers.ReadOnlyField(source='id')
    user_id = serializers.ReadOnlyField(source='order.user_id')
    order_id = serializers.ReadOnlyField(source='order.id')
    pair_id = serializers.ReadOnlyField(source='order.pair_id')
    price = serializers.ReadOnlyField(source='order.price')
    quantity = serializers.ReadOnlyField(source='order.quantity')
    direction = serializers.ReadOnlyField(source='order.direction')

    class Meta:
        model = CancelOrder
        fields = ('cancelorder_id', 'user_id', 'order_id', 'pair_id', 'price', 'quantity', 'direction', 'create_time',
                  'order_type', 'status')
