# -*- encoding: utf-8 -*-

from django.conf.urls import url

from .views import AdvertiseAPIView, AdvertiseDetailAPIView, TicketAPIView, TicketDetailAPIView

"""
# CRUD

* C
    - POST /
* R
    - GET /
    - GET /pk
* U
    - PUT /pk
* D
    - DELETE /pk
"""

app_name = 'OTC'

urlpatterns = [
    url(r'^ad$', AdvertiseAPIView.as_view()),
    url(r'^ad/(?P<pk>[0-9]+)$', AdvertiseDetailAPIView.as_view()),
    url(r'^ticket$', TicketAPIView.as_view()),
    url(r'^ticket/(?P<pk>[0-9]+)$', TicketDetailAPIView.as_view()),
]
