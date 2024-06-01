from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
import uuid

from .utils import generate_invoice_number

class Address(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    street_address = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    state = models.CharField(max_length=255, blank=True, null=True)
    postal_code = models.CharField(max_length=255)
    country = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.street_address}, {self.city}, {self.country}"


class Client(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    address = models.ForeignKey(
        Address, on_delete=models.SET_NULL, null=True, related_name="client_address"
    )

    def __str__(self):
        return self.name


class Seller(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(get_user_model(), on_delete=models.CASCADE)
    address = models.ForeignKey(
        Address, on_delete=models.SET_NULL, null=True, related_name="seller_address"
    )

    def __str__(self):
        return self.user.username


class Invoice(models.Model):
    status_choices = [
        ("draft", "Draft"),
        ("pending", "Pending"),
        ("paid", "Paid"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    sender_address = models.ForeignKey(
        Address, on_delete=models.CASCADE, related_name="sender_address"
    )
    invoice_number = models.CharField(
        max_length=10, default=generate_invoice_number, unique=True
    )
    created_by = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    project_description = models.CharField(max_length=255)
    invoice_date = models.DateField()
    due_date = models.DateField()
    total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=status_choices, default="draft")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.invoice_number


class InvoiceItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE)
    description = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    item_total = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.description
