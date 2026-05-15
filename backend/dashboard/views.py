from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Sales, Target
from .serializers import SalesSerializer, TargetSerializer

@api_view(['GET'])
def sales_list(request):
    client_id = request.headers.get('Client-Id')

    if not client_id:
        return Response({'error': 'Client-Id is required'}, status=400)
    
    sales = Sales.objects.filter(client_id=client_id)

    serializer = SalesSerializer(sales, many=True)

    return Response(serializer.data)


@api_view(['GET'])
def update_target(request):
    client_id = request.headers.get('Client-Id')
    monthly_goal = request.data.get('monthly_goal')

    target, created = Target.objects.get_or_create(
        client_id=client_id,
        defaults={'monthly_goal': monthly_goal})

    if not client_id:
        target.monthly_goal = monthly_goal
        target.save()

    serializer = TargetSerializer(target)

    return Response(serializer.data)    
   