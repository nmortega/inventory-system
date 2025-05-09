from rest_framework import viewsets
from .models import StorageLocation, StorageMedium, Item, TrackedItemRecord
from .serializers import (
    StorageLocationSerializer,
    StorageMediumSerializer,
    ItemSerializer,
    TrackedItemRecordSerializer,
)

# Create your views here.
class StorageLocationViewSet(viewsets.ModelViewSet):
    queryset = StorageLocation.objects.all()
    serializer_class = StorageLocationSerializer

class StorageMediumViewSet(viewsets.ModelViewSet):
    queryset = StorageMedium.objects.all()
    serializer_class = StorageMediumSerializer
class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
class TrackedItemRecordViewSet(viewsets.ModelViewSet):
    queryset = TrackedItemRecord.objects.all()
    serializer_class = TrackedItemRecordSerializer