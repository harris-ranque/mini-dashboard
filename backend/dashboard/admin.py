from django.contrib import admin
from .models import Client, Target, Sales

# Register your models here.
admin.site.register(Client)
admin.site.register(Target)
admin.site.register(Sales)