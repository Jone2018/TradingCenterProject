# -*- coding: utf-8 -*-
from rest_framework import viewsets

from .serializers import FundsSerializer, FrozenFundSerializer, UnfrozenFundSerializer, TransferFundSerializer
from ..models import Funds, FrozenFund, UnfrozenFund, TransferFund

''' 用户资产
'''


class FundsViewSet(viewsets.ModelViewSet):
    queryset = Funds.objects.all()
    serializer_class = FundsSerializer


''' 冻结资金
'''


class FrozenFundViewSet(viewsets.ModelViewSet):
    queryset = FrozenFund.objects.all()
    serializer_class = FrozenFundSerializer


''' 解冻资金
'''


class UnfrozenFundViewSet(viewsets.ModelViewSet):
    queryset = UnfrozenFund.objects.all()
    serializer_class = UnfrozenFundSerializer


''' 过户资金
'''


class TransferFundViewSet(viewsets.ModelViewSet):
    queryset = TransferFund.objects.all()
    serializer_class = TransferFundSerializer
