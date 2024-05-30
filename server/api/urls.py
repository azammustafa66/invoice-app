from django.urls import path

from .views import *

urlpatterns = [
    path("", test_set_tokens, name="test_set_tokens"),
    path("test", test_get_tokens, name="test_get_tokens"),
]