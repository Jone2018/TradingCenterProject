# -*- encoding: utf-8 -*-

from django.conf.urls import url, include

from . import views

app_name = 'Market'
urlpatterns = [
    url(r'^trade_list$', views.trade_list, name='trade_list'),
    url(r'^market_info$', views.market_info, name='market_info'),
    url(r'^kline$', views.kline, name='kline'),
    url(r'^get_cny_rate$', views.get_cny_rate, name='get_cny_rate'),
]
