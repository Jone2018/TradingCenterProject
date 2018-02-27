from django.conf.urls import url
from .views import (Ticker, Depth, Trades)

app_name = 'MarketAPI'
urlpatterns = [
    url(r'^ticker', Ticker.as_view()),
    url(r'^depth', Depth.as_view()),
    url(r'^trades', Trades.as_view()),
]
