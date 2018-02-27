# -*- encoding: utf-8 -*-

from django.conf.urls import url, include
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register('funds', views.FundsViewSet)
router.register('frozenfund', views.FrozenFundViewSet)
router.register('unfrozenfund', views.UnfrozenFundViewSet)
router.register('transferfund', views.TransferFundViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
]
