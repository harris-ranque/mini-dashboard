from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Client, Sales, Target
from .serializers import ClientSerializer, SalesSerializer, TargetSerializer

def _get_client_id(request):
    return request.headers.get('Client-Id') or request.headers.get('client_id')


@api_view(['GET'])
def clients_list(request):
    clients = Client.objects.order_by('name')
    serializer = ClientSerializer(clients, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def sales_list(request):
    client_id = _get_client_id(request)

    if not client_id:
        return Response({'error': 'Client-Id header is required'}, status=400)

    sales = Sales.objects.filter(client_id=client_id)
    serializer = SalesSerializer(sales, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def update_target(request):
    client_id = request.data.get('client_id')
    monthly_goal = request.data.get('monthly_goal')

    if not client_id:
        return Response({'error': 'client_id is required'}, status=400)
    if monthly_goal is None:
        return Response({'error': 'monthly_goal is required'}, status=400)

    target, created = Target.objects.get_or_create(
        client_id=client_id,
        defaults={'monthly_goal': monthly_goal},
    )

    if not created:
        target.monthly_goal = monthly_goal
        target.save()

    serializer = TargetSerializer(target)
    return Response(serializer.data)
   