# -*- encoding: utf-8 -*-

import json
import logging

from django.conf import settings
from kafka import KafkaProducer
from kafka.errors import KafkaError

LOGGER = logging.getLogger(__name__)

conf = settings.KAFKA_SETTINGS

LOGGER.debug(conf)

local_producer = KafkaProducer(bootstrap_servers=conf['bootstrap_servers'])


def produce_order(order_data, topic):
    pickled_order_data = json.dumps(order_data)
    try:
        future = local_producer.send(topic, pickled_order_data)
        future.get()
        LOGGER.debug('Order send succeed.')
    except KafkaError as e:
        LOGGER.error('Order send Failed...\n<%s>' % e)
