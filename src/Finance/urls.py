# -*- encoding: utf-8 -*-

from django.conf.urls import url

from . import views

app_name = 'Finance'
urlpatterns = [
    url(r'^get_funds$', views.get_funds, name='get_funds'),
    url(r'^get_coin_address$', views.get_coin_address, name='get_coin_address'),
    url(r'^user_balance_log$', views.user_balance_log, name='user_balance_log'),
    url(r'^user_balance_history$', views.user_balance_history, name='user_balance_history'),
    url(r'^add_address$', views.add_address, name='add_address'),
    url(r'^withdraw$', views.withdraw, name='withdraw'),
    url(r'^cancel_withdraw$', views.cancel_withdraw, name='cancel_withdraw'),
    url(r'^get_address_list$', views.get_address_list, name='get_address_list'),
    url(r'^get_fund$', views.get_fund, name='get_fund'),
    url(r'^del_wdr_addr$', views.del_wdr_addr, name='del_wdr_addr'),
    url(r'^transfer$', views.transfer, name='transfer'),
    url(r'^cointype_property$', views.cointype_property, name='cointype_property'),
    url(r'^send_ulogos', views.send_ulogos, name='send_ulogos'),

    url(r'^wkc_charge$', views.wkc_charge, name='wkc_charge'),
    url(r'^cancel_wkc_charge$', views.cancel_wkc_charge, name='cancel_wkc_charge'),
    url(r'^wkc_charge_list$', views.wkc_charge_list, name='wkc_charge_list'),
]
