"""TradingCenter URL Configuration

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
from django.contrib import admin
from rest_framework.documentation import include_docs_urls
from django.views.generic import TemplateView
from django.views.i18n import JavaScriptCatalog

from FrontPage import views


API_TITLE = 'SuiQiu API View'
API_DESCRIPTION = API_TITLE


urlpatterns = [
    url(r"^$", TemplateView.as_view(template_name="index.html"), name="home"),
    url(r'^i18n/', include('django.conf.urls.i18n')),
    url(r"^(?P<template_name>.*\..+)$", views.as_i18n_view),
    url(r'^jsi18n/$', JavaScriptCatalog.as_view(), name="javascript-catalog"),

    url(r'^admin/', admin.site.urls),

    url(r'^docs/', include_docs_urls(title=API_TITLE, description=API_DESCRIPTION)),
    url(r'^api-auth/', include('rest_framework.urls')),

    url(r"^api/account/", include("Account.urls", namespace='account')),
    url(r'^api/social/', include('social_django.urls', namespace='social')),
    url(r'^api/finance/', include('Finance.urls', namespace='finance')),
    url(r'^api/otc/', include('OTC.api.urls', namespace='otc')),
    url(r'^api/market/', include('Market.urls', namespace='market')),
    url(r'^api/trade/', include('Order.urls', namespace='trade')),
    url(r'^api/notice/', include('Notice.urls', namespace='notice')),
    url(r'^api/question/', include('Question.urls', namespace='question')),
]
