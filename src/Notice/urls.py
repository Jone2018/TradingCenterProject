# -*- encoding: utf-8 -*-

from django.conf.urls import url

from . import views

app_name = 'Notice'
urlpatterns = [
    url(r'^get_notice$', views.get_notice, name='get_notice'),
    url(r'^get_notice_list$', views.get_notice_list, name='get_notice_list'),
    url(r'^get_message_count$', views.get_message_count, name='get_message_count'),
    url(r'^get_all_messages$', views.get_all_messages, name='get_all_messages'),
    url(r'^get_notRead_messages$', views.get_notRead_messages, name='get_notRead_messages'),
    url(r'^get_isRead_messages$', views.get_isRead_messages, name='get_isRead_messages'),
    url(r'^message_info$', views.message_info, name='message_info'),
    url(r'^delete_messages$', views.delete_messages, name='delete_messages'),
    url(r'^isRead_messages$', views.isRead_messages, name='isRead_messages')

]
