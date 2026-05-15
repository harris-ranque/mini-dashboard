from django.urls import path
from .views import sales_list, update_target

urlpatterns = [
    path('sales/', sales_list, name='sales_list'),
    path('target/', update_target, name='update_target'),
]