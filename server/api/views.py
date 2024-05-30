from django.http import HttpRequest
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from utils.APIResponse import APIResponse
from utils.APIError import APIError


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def test_set_tokens(req: HttpRequest) -> Response:
    username = req.data.get("username")
    password = req.data.get("password")

    if not username or not password:
        return Response(
            {"error": "Username and password are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = authenticate(username=username, password=password)

    if not user:
        return APIError(
            status=status.HTTP_400_BAD_REQUEST,
            message="Invalid credentials.",
        )

    refresh = RefreshToken.for_user(user)
    access_token = refresh.access_token

    return APIResponse(
        data={"access_token": str(access_token), "refresh_token": str(refresh)},
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def test_get_tokens(req: HttpRequest) -> APIResponse:
    return APIResponse(
        data={"message": "You are authenticated."},
        status=status.HTTP_200_OK,
        message="Success",
        success=True,
    )
