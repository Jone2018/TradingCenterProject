# -*- encoding: utf-8 -*-

from captcha.helpers import captcha_image_url
from captcha.models import CaptchaStore
from django.contrib import auth
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.views import APIView

from .serializers import UserSerializer


class CaptchaAPI(APIView):
    def get(self, request, format=None):
        hashkey = CaptchaStore.pick()
        captcha_url = captcha_image_url(hashkey)
        return Response({'url': captcha_url}, status=status.HTTP_200_OK)


@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'login': reverse('api_account:login', request=request, format=format),
        'signup': reverse('api_account:signup', request=request, format=format)
    })


class LoginAPI(APIView):
    def post(self, request, format=None):
        if request.data['username'] and request.data['password']:
            user = auth.authenticate(username=request.data['username'], password=request.data['password'])
            if user is None:
                return Response({'success': False}, status=status.HTTP_401_UNAUTHORIZED)

            auth.login(request, user)
            print(request.session)
            if user.is_authenticated:
                return Response({'success': True}, status=status.HTTP_200_OK)

        return Response({'success': False}, status=status.HTTP_401_UNAUTHORIZED)


class SignupAPI(APIView):
    def post(self, request, format=None):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.validated_data['password'] = make_password(serializer.validated_data['password'])
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # class UserViewSet(viewsets.ModelViewSet):
#     """
#     API endpoint that allows users to be viewed or edited.
#     """
#     queryset = User.objects.all().order_by('-date_joined')
#     serializer_class = UserSerializer

#     def perform_create(self, serializer):
#         serializer.validated_data['password'] = make_password(serializer.validated_data['password'])
#         serializer.save()


# class GroupViewSet(viewsets.ModelViewSet):
#     """
#     API endpoint that allows groups to be viewed or edited.
#     """
#     queryset = Group.objects.all()
#     serializer_class = GroupSerializer
