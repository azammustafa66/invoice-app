from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken


from .serializers import *


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
