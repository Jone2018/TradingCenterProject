# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.conf import settings
from django.conf.urls import url
from django.contrib import admin, messages
from django.contrib.admin.options import IS_POPUP_VAR
from django.contrib.admin.utils import unquote
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.admin import Group
from django.contrib.auth.forms import AdminPasswordChangeForm
from django.core.exceptions import PermissionDenied
from django.db import router, transaction
from django.http import Http404, HttpResponseRedirect
from django.template.response import TemplateResponse
from django.urls import reverse
from django.utils.decorators import method_decorator
from django.utils.encoding import force_text
from django.utils.html import escape
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.debug import sensitive_post_parameters

from .forms import UserCreationForm, UserChangeForm
from .models import User, Profile, LoginHistory, Realname

csrf_protect_m = method_decorator(csrf_protect)
sensitive_post_parameters_m = method_decorator(sensitive_post_parameters())

admin.site.unregister(Group)


class ProfileInline(admin.StackedInline):
    model = Profile
    readonly_fields = ('avatar', 'nickname')
    can_delete = False
    verbose_name_plural = '用户属性'


class RealnameInline(admin.StackedInline):
    model = Realname
    can_delete = False
    verbose_name_plural = '用户实名信息'


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    add_form_template = 'admin/auth/user/add_form.html'
    change_user_password_template = None
    fieldsets = (
        (None, {'fields': ('id', 'username', 'password')}),
        ('安全设置', {'fields': (
            'is_phone_verified', 'is_email_verified',
        )}),
        ('登录信息', {'fields': ('date_joined', 'last_login', 'last_login_ip')}),
        ('权限管理', {'fields': ('is_active',)}),
        ('修改实名认证状态', {'fields': ('is_realname_verified',)})
    )
    inlines = (ProfileInline, RealnameInline)
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2'),
        }),
    )
    readonly_fields = ('id', 'username', 'date_joined', 'last_login', 'last_login_ip')
    form = UserChangeForm
    add_form = UserCreationForm
    change_password_form = AdminPasswordChangeForm

    def realName(self, obj):
        rn = Realname.objects.get(user__id=obj.id)
        return rn.realname

    realName.short_description = '真实姓名'

    list_display = (
        'id', 'username', 'realName', 'phone_number', 'email', 'date_joined', 'is_email_verified',
        'is_phone_verified', 'is_realname_verified', 'is_active'
    )
    list_filter = ('is_active', 'is_realname_verified', 'is_phone_verified', 'is_email_verified')
    search_fields = ('id', 'username', 'phone_number', 'email')
    ordering = ('username',)
    filter_horizontal = ('groups', 'user_permissions',)

    def get_fieldsets(self, request, obj=None):
        if not obj:
            return self.add_fieldsets
        return super(UserAdmin, self).get_fieldsets(request, obj)

    def get_form(self, request, obj=None, **kwargs):
        """
        Use special form during user creation
        """
        defaults = {}
        if obj is None:
            defaults['form'] = self.add_form
        defaults.update(kwargs)
        return super(UserAdmin, self).get_form(request, obj, **defaults)

    def get_urls(self):
        return [
                   url(
                       r'^(.+)/password/$',
                       self.admin_site.admin_view(self.user_change_password),
                       name='auth_user_password_change',
                   ),
               ] + super(UserAdmin, self).get_urls()

    def get_actions(self, request):
        actions = super(UserAdmin, self).get_actions(request)
        if actions.has_key('delete_selected'):
            del actions['delete_selected']
        return actions

    def lookup_allowed(self, lookup, value):
        # See #20078: we don't want to allow any lookups involving passwords.
        if lookup.startswith('password'):
            return False
        return super(UserAdmin, self).lookup_allowed(lookup, value)

    @sensitive_post_parameters_m
    @csrf_protect_m
    def add_view(self, request, form_url='', extra_context=None):
        with transaction.atomic(using=router.db_for_write(self.model)):
            return self._add_view(request, form_url, extra_context)

    def _add_view(self, request, form_url='', extra_context=None):
        # It's an error for a user to have add permission but NOT change
        # permission for users. If we allowed such users to add users, they
        # could create superusers, which would mean they would essentially have
        # the permission to change users. To avoid the problem entirely, we
        # disallow users from adding users if they don't have change
        # permission.
        if not self.has_change_permission(request):
            if self.has_add_permission(request) and settings.DEBUG:
                # Raise Http404 in debug mode so that the user gets a helpful
                # error message.
                raise Http404(
                    'Your user does not have the "Change user" permission. In '
                    'order to add users, Django requires that your user '
                    'account have both the "Add user" and "Change user" '
                    'permissions set.')
            raise PermissionDenied
        if extra_context is None:
            extra_context = {}
        username_field = self.model._meta.get_field(self.model.USERNAME_FIELD)
        defaults = {
            'auto_populated_fields': (),
            'username_help_text': username_field.help_text,
        }
        extra_context.update(defaults)
        return super(UserAdmin, self).add_view(request, form_url,
                                               extra_context)

    @sensitive_post_parameters_m
    def user_change_password(self, request, id, form_url=''):
        if not self.has_change_permission(request):
            raise PermissionDenied
        user = self.get_object(request, unquote(id))
        if user is None:
            raise Http404('%(name)s object with primary key %(key)r does not exist.' % {
                'name': force_text(self.model._meta.verbose_name),
                'key': escape(id),
            })
        if request.method == 'POST':
            form = self.change_password_form(user, request.POST)
            if form.is_valid():
                form.save()
                change_message = self.construct_change_message(request, form, None)
                self.log_change(request, user, change_message)
                msg = 'Password changed successfully.'
                messages.success(request, msg)
                update_session_auth_hash(request, form.user)
                return HttpResponseRedirect(
                    reverse(
                        '%s:%s_%s_change' % (
                            self.admin_site.name,
                            user._meta.app_label,
                            user._meta.model_name,
                        ),
                        args=(user.pk,),
                    )
                )
        else:
            form = self.change_password_form(user)

        fieldsets = [(None, {'fields': list(form.base_fields)})]
        adminForm = admin.helpers.AdminForm(form, fieldsets, {})

        context = {
            'title': '修改密码： %s' % escape(user.get_username()),
            'adminForm': adminForm,
            'form_url': form_url,
            'form': form,
            'is_popup': (IS_POPUP_VAR in request.POST or
                         IS_POPUP_VAR in request.GET),
            'add': True,
            'change': False,
            'has_delete_permission': False,
            'has_change_permission': True,
            'has_absolute_url': False,
            'opts': self.model._meta,
            'original': user,
            'save_as': False,
            'show_save': True,
        }
        context.update(self.admin_site.each_context(request))

        request.current_app = self.admin_site.name

        return TemplateResponse(
            request,
            self.change_user_password_template or
            'admin/auth/user/change_password.html',
            context,
        )

    def response_add(self, request, obj, post_url_continue=None):
        """
        Determines the HttpResponse for the add_view stage. It mostly defers to
        its superclass implementation but is customized because the User model
        has a slightly different workflow.
        """
        # We should allow further modification of the user just added i.e. the
        # 'Save' button should behave like the 'Save and continue editing'
        # button except in two scenarios:
        # * The user has pressed the 'Save and add another' button
        # * We are adding a user in a popup
        if '_addanother' not in request.POST and IS_POPUP_VAR not in request.POST:
            request.POST = request.POST.copy()
            request.POST['_continue'] = 1
        return super(UserAdmin, self).response_add(request, obj,
                                                   post_url_continue)

    class Media:
        js = (
            '/static/js/realname-picture.js',
        )


@admin.register(LoginHistory)
class LoginHistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'login_time', 'login_ip', 'login_addr')
    list_filter = ('user', 'login_time', 'login_ip', 'login_addr')
    search_fields = ('user', 'login_ip', 'login_addr')
    ordering = ['login_time']

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def get_actions(self, request):
        return None

    def get_list_display_links(self, request, list_display):
        return None


@admin.register(Realname)
class RealnameAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'realname', 'id_card_no', 'id_type', 'create_time', 'info_status', 'pic_status')
    list_filter = ('id_type', 'create_time', 'info_status', 'pic_status')
    search_fields = ('user__id', 'realname', 'id_card_no')
    ordering = ['info_status', 'pic_status', '-create_time']

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def get_actions(self, request):
        return None

    def get_list_display_links(self, request, list_display):
        return None
