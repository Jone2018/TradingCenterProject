# coding=utf-8
import datetime
import logging

from rest_framework import generics
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from OTC.models import Advertise, Ticket
from .permissions import IsOwnerOrReadOnly, IsOwnerAndReadOnly
from .serializers import AdvertiseSerializer, TicketSerializer

logger = logging.getLogger(__name__)


class AdvertiseAPIView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    pagination_class = LimitOffsetPagination

    queryset = Advertise.get_valid_advertises()  # Nice.
    serializer_class = AdvertiseSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AdvertiseDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsOwnerOrReadOnly,)
    queryset = Advertise.objects.all()
    serializer_class = AdvertiseSerializer


class TicketAPIView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    pagination_class = LimitOffsetPagination

    queryset = Ticket.get_valid_tickets()  # Nice.
    serializer_class = TicketSerializer

    def get(self, request, *args, **kwargs):
        Ticket.remove_expired()
        return self.list(request, *args, **kwargs)

    def perform_create(self, serializer):
        try:
            target_obj = serializer.validated_data.get("target")

            expire_time = datetime.datetime.now() + datetime.timedelta(minutes=target_obj.pay_time_limit)

            ticket_obj = serializer.save(user=self.request.user, expire_time=expire_time)

            ticket_owner = ticket_obj.user
            target_user = target_obj.user

            ticket_owner.send_phone_captcha("用户{}：已经下单 对方： {}".format(ticket_owner.uid, target_user.uid))
            target_user.send_phone_captcha("ABC")
        except Exception as e:
            logger.error(e)


class TicketDetailAPIView(generics.RetrieveDestroyAPIView):
    """
    Ticket下单后，不允许修改
    """
    permission_classes = (IsOwnerAndReadOnly,)
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer

    def perform_destroy(self, instance):
        instance.owner_delete()
