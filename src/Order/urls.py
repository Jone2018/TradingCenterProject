# -*- encoding: utf-8 -*-

from django.conf.urls import url, include

from . import views

app_name = 'Order'
urlpatterns = [
    url(r'^trade_pwd_status$', views.trade_pwd_status, name='trade_pwd_status'),
    url(r'^put_order$', views.put_order, name='put_order'),
    url(r'^get_order_list$', views.get_order_list, name='get_order_list'),
    url(r'^cancel_order$', views.cancel_order, name='cancel_order'),
    # url(r'^trade_list_30$', views.trade_list_30, name='trade_list_30trade_list_30'),
]
