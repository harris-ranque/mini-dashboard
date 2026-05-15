from django.urls import path
from .views import clients_list, sales_list, target

urlpatterns = [
    path('clients/', clients_list, name='clients_list'),
    path('sales/', sales_list, name='sales_list'),
    path('target/', target, name='target'),
]