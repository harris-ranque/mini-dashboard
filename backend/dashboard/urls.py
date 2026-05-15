from django.urls import path
from .views import clients_list, sales_list, update_target

urlpatterns = [
    path('clients/', clients_list, name='clients_list'),
    path('sales/', sales_list, name='sales_list'),
    path('target/', update_target, name='update_target'),
]