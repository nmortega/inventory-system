from rest_framework import serializers
from .models import StorageLocation, StorageMedium, Item, TrackedItemRecord

class StorageLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = StorageLocation
        fields = '__all__'

class StorageMediumSerializer(serializers.ModelSerializer):
    class Meta:
        model = StorageMedium
        fields = '__all__'

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

    def to_internal_value(self, data):
        data = data.copy()

        location_name = data.get('storage_location')
        if location_name and isinstance(location_name, str):
            location_obj, _ = StorageLocation.objects.get_or_create(name=location_name)
            data['storage_location'] = location_obj.id
        
        medium_name = data.get('storage_medium')
        if medium_name and isinstance(medium_name, str):
            medium_obj, _ = StorageMedium.objects.get_or_create(name=medium_name, storage_location=location_obj)
            data['storage_medium'] = medium_obj.id
        
        return super().to_internal_value(data)
        
class TrackedItemRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrackedItemRecord
        fields = '__all__'