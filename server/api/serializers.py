from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "first_name"]


class RegisterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True, required=True)
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    confirmPassword = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ["email", "password", "confirmPassword", "name"]

    def validate(self, attrs):
        """
        Check if the password and confirmPassword fields match.
        """
        if attrs["password"] != attrs["confirmPassword"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match"}
            )
        return attrs

    def create(self, validated_data):
        """
        Create a new user with the validated data.
        """
        user = User.objects.create_user(
            username=validated_data["email"],
            first_name=validated_data["name"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom TokenObtainPairSerializer to include additional user data in the response.
    """

    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = {
            "id": self.user.id,
            "email": self.user.email,
            "name": self.user.first_name,
        }
        return data
