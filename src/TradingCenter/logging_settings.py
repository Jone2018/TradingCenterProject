import os


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        },
        'require_debug_true': {
            '()': 'django.utils.log.RequireDebugTrue'
        },
    },
    'formatters': {
        'verbose': {
            'format': '%(asctime)s [%(threadName)s:%(thread)d] [%(name)s:%(lineno)d] [%(module)s:%(funcName)s] [%(levelname)s]- %(message)s',
            'datefmt': "%Y/%b/%d %H:%M:%S"
        },
        'simple': {
            'format': '%(levelname)s|%(message)s'
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
            'filters': ['require_debug_true'],
        },
        'info': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': os.path.join(BASE_DIR, 'logs/django.log'),
            'maxBytes': 1024 * 1024 * 5,  # 5MB
            'backupCount': 10,
            'formatter': 'verbose',
        },
        'warn': {
            'level': 'WARNING',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': os.path.join(BASE_DIR, 'logs/warning.log'),
            'maxBytes': 1024 * 1024 * 5,  # 5MB
            'backupCount': 10,
            'formatter': 'verbose',
            'filters': ['require_debug_false'],
        },
        'error': {
            'level': 'WARNING',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': os.path.join(BASE_DIR, 'logs/error.log'),
            'maxBytes': 1024 * 1024 * 5,  # 5MB
            'backupCount': 10,
            'formatter': 'verbose',
            'filters': ['require_debug_false'],
        },
    },
    'loggers': {
        # This is the "catch all" logger
        '': {
            'handlers': ['console', 'info', 'warn', 'error'],
            'level': 'DEBUG',
            'propagate': False,
        },
    }
}
