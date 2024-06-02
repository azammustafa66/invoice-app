from django.urls import path

from .views import *

urlpatterns = [
    path("auth/get-csrf-token", GetCSRFToken.as_view(), name="csrf"),
    path("auth/register", RegisterView.as_view(), name="register"),
    path("auth/login", LoginView.as_view(), name="login")
]
