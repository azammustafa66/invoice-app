from django.contrib import admin

from .models import *

admin.site.register(Address)
admin.site.register(Client)
admin.site.register(Seller)
admin.site.register(Invoice)
admin.site.register(InvoiceItem)
