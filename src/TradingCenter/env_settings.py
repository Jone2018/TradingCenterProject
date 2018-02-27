# Put the develop environment settings here.
import os

DEV_SETTINGS = {
    "DBUSER": "root",
    "DBPWD": "root",
    "DBHOST": "54.250.252.161",
    "DBPORT": "3306",
    "REDISHOST": "localhost",
    "KAFKAHOST": "localhost",
    "MEMCACHE_HOST": "localhost",
    "MEMCACHE_PORT": "11211",
}


def load_dev_settings():
    for key, val in DEV_SETTINGS.iteritems():
        os.environ[key] = val
