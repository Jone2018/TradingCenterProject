# coding=utf-8
"""
Django settings for TradingCenter project.

Generated by 'django-admin startproject' using Django 1.11.

For more information on this file, see
https://docs.djangoproject.com/en/1.11/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.11/ref/settings/
"""

import os
from .env_settings import load_dev_settings
from .logging_settings import LOGGING


# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.11/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '_k%me7r1al-_hv@aulcv*^sp9^+h7dah!gt=5s3j=9%w_-33=r'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

load_dev_settings()

ALLOWED_HOSTS = ["*"]

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',

    'FrontPage',
    'Account.apps.AccountConfig',
    'Dic.apps.DicConfig',
    'Finance.apps.FinanceConfig',
    'OTC.apps.OtcConfig',
    'Market.apps.MarketConfig',
    'Notice.apps.NoticeConfig',
    'Order.apps.OrderConfig',
    'Question.apps.QuestionConfig',

    'captcha',
    'phonenumber_field',
    'social_django',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'TradingCenter.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.i18n',
            ],
        },
    },
]

WSGI_APPLICATION = 'TradingCenter.wsgi.application'

# Database
# https://docs.djangoproject.com/en/1.11/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'chaobi',
        'USER': os.getenv("DBUSER"),
        'PASSWORD': os.getenv("DBPWD"),
        'HOST': os.getenv("DBHOST"),
        'PORT': os.getenv("DBPORT", "3306"),
    },
    'market_db': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'chaobi-market',
        'USER': os.getenv("DBUSER"),
        'PASSWORD': os.getenv("DBPWD"),
        'HOST': os.getenv("DBHOST"),
        'PORT': os.getenv("DBPORT", "3306"),
    },
    'order_db': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'chaobi-order',
        'USER': os.getenv("DBUSER"),
        'PASSWORD': os.getenv("DBPWD"),
        'HOST': os.getenv("DBHOST"),
        'PORT': os.getenv("DBPORT", "3306"),
    },
    'service_db': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'chaobi-service',
        'USER': os.getenv("DBUSER"),
        'PASSWORD': os.getenv("DBPWD"),
        'HOST': os.getenv("DBHOST"),
        'PORT': os.getenv("DBPORT", "3306"),
    }
}

DATABASE_ROUTERS = ['TradingCenter.routers.DatabaseAppsRouter']

DATABASE_APPS_MAPPING = {
    'Order': 'order_db',
    'Market': 'market_db',
    'Notice': 'service_db',
    'Question': 'service_db',
}

# Password validation
# https://docs.djangoproject.com/en/1.11/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/1.11/topics/i18n/

LANGUAGE_CODE = 'zh-hans'

TIME_ZONE = 'Asia/Shanghai'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.11/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
# STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# non-default

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.memcached.MemcachedCache',
        'LOCATION': "{}:{}".format(os.getenv("MEMCACHE_HOST"), os.getenv("MEMCACHE_PORT")),
    }
}

# Redis

REDIS_HOST = os.getenv("REDISHOST")
REDIS_PWD = os.getenv("REDISPWD")

# Kafka

KAFKA_SETTINGS = {
    'bootstrap_servers': os.getenv("KAFKAHOST"),
    'topic_name': os.getenv("ORDER_TOPIC"),
}

# Session
SESSION_ENGINE = "django.contrib.sessions.backends.cache"

AUTH_USER_MODEL = 'Account.User'

APPEND_SLASH = False

LANGUAGES = (
    ('en', ('English')),
    ('zh-hans', ('中文简体')),
    ('zh-hant', ('中文繁體')),
)

LOCALE_PATHS = (
    os.path.join(BASE_DIR, 'locale'),
)

# API
MAX_API_KEY_PAIR_NUM = 5

AUTHENTICATION_BACKENDS = [
    "social_core.backends.qq.QQOAuth2",
    'Account.auth_backends.PhonenumberAuthenticationBackend',
    'Account.auth_backends.EmailAuthenticationBackend',
    'django.contrib.auth.backends.ModelBackend',
    'social_core.backends.weibo.WeiboOAuth2',
    'social_core.backends.weixin.WeixinOAuth2',
]

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        # 'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly',
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.BrowsableAPIRenderer' if DEBUG else 'rest_framework.renderers.JSONRenderer',
        # 'rest_framework.renderers.JSONRenderer',
    )
}
