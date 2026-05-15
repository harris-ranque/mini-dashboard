# pyright: reportIncompatibleVariableOverride=false

from rest_framework import serializers

from .models import Client, Sales, Target


class ClientSerializer(serializers.ModelSerializer[Client]):
    class Meta:
        model = Client
        fields = ['id', 'name']


class SalesSerializer(serializers.ModelSerializer[Sales]):
    class Meta:
        model = Sales
        fields = '__all__'


class TargetSerializer(serializers.ModelSerializer[Target]):
    class Meta:
        model = Target
        fields = '__all__'
