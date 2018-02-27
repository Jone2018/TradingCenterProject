"""FrontEnd URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.views.generic import TemplateView
from django.views.i18n import JavaScriptCatalog

from . import views

urlpatterns = [
    url(r"^$", TemplateView.as_view(template_name="index.html"), name="home"),
    url(r'^i18n/', include('django.conf.urls.i18n')),
    url(r"^(?P<template_name>.*\..+)$", views.as_i18n_view),
]

urlpatterns += [
    url(r'^jsi18n/$', JavaScriptCatalog.as_view(), name="javascript-catalog"),
]

# urlpatterns += [
#     url(r"^api/social/login/", views.redirect_social_login, name="redirect_social_login"),
#     url(r"^api/social/complete/", views.redirect_social_complete, name="redirect_social_complete"),
#
#     url(r"^api/account/", views.redirect_account, name="redirect_account"),
#     url(r"^api/finance/", views.redirect_finance, name="redirect_finance"),
#     url(r"^api/ico/", views.redirect_ico, name="redirect_ico"),
#     url(r"^api/trade/", views.redirect_order, name="redirect_order"),
#     url(r"^api/transaction/", views.redirect_transaction, name="redirect_transaction"),
#     url(r"^api/market/", views.redirect_market, name="redirect_market"),
#     url(r"^api/notice/", views.redirect_service, name="redirect_service"),
#     url(r"^api/notice/", views.redirect_service, name="redirect_service_notice"),
#     url(r"^api/question/", views.redirect_service, name="redirect_service_question"),
#     url(r"^api/otc/", views.redirect_service, name="redirect_service_otc"),
# ]
