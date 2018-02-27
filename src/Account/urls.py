# -*- encoding: utf-8 -*-

from django.conf.urls import url, include

from . import views

app_name = 'Account'
urlpatterns = [
    url(r'^signup$', views.user_signup, name='signup'),
    url(r'^email_signup$', views.email_signup, name='email_signup'),
    url(r'^login$', views.user_login, name='login'),
    url(r'^logout$', views.user_logout, name='logout'),
    url(r'^userinfo$', views.user_info, name='user_info'),
    url(r'^authinfo$', views.auth_info, name='auth_info'),
    url(r'^get_captcha$', views.get_captcha, name='get_captcha'),
    url(r'^get_is_read', views.get_is_read, name='get_is_read'),
    url(r'^send_phone_captcha$', views.send_phone_captcha, name='send_phone_captcha'),
    url(r'^send_email_confirmation$', views.send_email_confirmation, name='send_email_confirmation'),
    url(r'^confirm_email/(?P<key>\w+)/$', views.confirm_email, name='confirm_email'),
    url(r'^set_phone_number$', views.set_phone_number, name='set_phone_number'),
    url(r'^set_account_profile$', views.set_account_profile, name='set_account_profile'),
    url(r'^set_email$', views.set_email, name='set_email'),
    url(r'^set_realname$', views.set_realname, name='set_realname'),
    url(r'^set_is_read', views.set_is_read, name='set_is_read'),
    # url(r'^set_phone_number$', views.set_phone_number, name='set_phone_number'),
    url(r'^set_trade_password$', views.set_trade_password, name='set_trade_password'),
    url(r'^reset_password$', views.reset_password, name='reset_password'),
    url(r'^change_password$', views.change_password, name='change_password'),
    url(r'^verify_phoneOremail$', views.verify_phoneOremail, name='verify_phoneOremail'),
    url(r'^send_email_captcha$', views.send_email_captcha, name='send_email_captcha'),
    url(r'^email_reset_password$', views.email_reset_password, name='email_reset_password'),
    url(r'^get_token$', views.get_token, name='get_token'),
    # url(r'^set_account_profile$', views.set_account_profile, name='set_account_profile'),
    url(r'^get_api_permission_list$', views.get_api_permission_list, name='get_api_permission_list'),
    url(r'^create_api_key_pair$', views.create_api_key_pair, name='get_api_key_pair'),
    url(r'^get_api_list$', views.get_api_list, name='get_api_list'),
    url(r'^get_api_detail$', views.get_api_detail, name='get_api_detail'),
    url(r'^update_api_info$', views.update_api_info, name='update_api_info'),
    url(r'^delete_api_key_pair$', views.delete_api_key_pair, name='delete_api_key_pair'),

    url(r"^captcha/", include("captcha.urls")),

]
