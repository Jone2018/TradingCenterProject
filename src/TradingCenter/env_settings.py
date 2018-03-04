# Put the develop environment settings here.
import os

DEV_SETTINGS = {
    "DBUSER": "root",
    "DBPWD": "root",
    "DBHOST": "54.250.252.161",
    "DBPORT": "3306",
    "REDISHOST": "116.196.100.165",
    "KAFKAHOST": "116.196.100.165",
    "MEMCACHE_HOST": "116.196.100.165",
    "MEMCACHE_PORT": "11211",
}


def load_dev_settings():
    for key, val in DEV_SETTINGS.iteritems():
        os.environ[key] = val
