# -*- encoding: utf-8 -*-

from django.conf.urls import url, include
from rest_framework.urlpatterns import format_suffix_patterns

# from rest_framework import routers
from . import views

# router = routers.DefaultRouter()
# router.register('users', views.UserViewSet)
# router.register('groups', views.GroupViewSet)

urlpatterns = format_suffix_patterns([
    url(r'^account/$', views.api_root),
    url(r'^account/captcha/$', views.CaptchaAPI.as_view()),
    url(r'^account/login/$', views.LoginAPI.as_view(), name='login'),
    url(r'^account/signup/$', views.SignupAPI.as_view(), name='signup'),
    # url(r'^', include(router.urls)),
])

# Login and logout views for the browsable API
urlpatterns += [
    url(r'^api-auth/', include('rest_framework.urls',
                               namespace='rest_framework')),
]
