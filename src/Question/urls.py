# -*- encoding: utf-8 -*-

from django.conf.urls import url

from . import views

app_name = 'Question'
urlpatterns = [
    url(r'^create_question$', views.create_question, name='create_question'),
    url(r'^get_question_list$', views.get_question_list, name='get_question_list'),
    url(r'^question_info$', views.question_info, name='question_info'),
    url(r'^question_delete$', views.question_delete, name='question_delete')
]
