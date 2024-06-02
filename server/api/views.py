from django.middleware.csrf import get_token
from rest_framework.views import APIView
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    RegisterSerializer,
    UserSerializer,
    CustomTokenObtainPairSerializer,
)


class GetCSRFToken(APIView):
    def get(self, request):
        csrf_token = get_token(request)
        response = Response({"csrfToken": csrf_token}, status=status.HTTP_200_OK)
        response.headers["X-CSRFToken"] = csrf_token
        return response


class RegisterView(generics.GenericAPIView):
    """
    Register a new user.
    """

    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request: Request) -> Response:
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh: RefreshToken = RefreshToken.for_user(user)
            access_token: str = str(refresh.access_token)
            return Response(
                status=status.HTTP_201_CREATED,
                data={
                    "user": UserSerializer(user).data,
                    "access_token": access_token,
                    "refresh_token": str(refresh),
                },
            )
        return Response(
            status=status.HTTP_400_BAD_REQUEST,
            data=serializer.errors,
        )


class LoginView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CustomTokenObtainPairSerializer
