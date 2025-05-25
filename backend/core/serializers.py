from rest_framework import serializers
from .models import StorageLocation, StorageMedium, Item, TrackedItemRecord, QuantityHistory

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

        # Ensure tracked is boolean
        tracked_val = data.get('tracked')
        if isinstance(tracked_val, str):
            data['tracked'] = tracked_val.lower() == 'true'
        elif isinstance(tracked_val, int):
            data['tracked'] = bool(tracked_val)

        # Resolve storage_location
        location_name = data.get("storage_location")
        if location_name and isinstance(location_name, str):
            location_obj, _ = StorageLocation.objects.get_or_create(name=location_name)
            data["storage_location"] = location_obj.id
        else:
            location_obj = None

        # Resolve storage_medium
        medium_name = data.get("storage_medium")
        if medium_name and isinstance(medium_name, str):
            medium_obj, _ = StorageMedium.objects.get_or_create(
                name=medium_name,
                storage_location=location_obj,
            )
            data["storage_medium"] = medium_obj.id

        return super().to_internal_value(data)

    def update(self, instance, validated_data):
        old_quantity = instance.quantity
        new_quantity = validated_data.get('quantity', old_quantity)
        print(">>> UPDATE TRIGGERED <<<")
        # Only log if tracked and quantity actually changed
        if instance.tracked and old_quantity != new_quantity:
            from .models import QuantityHistory  # prevent circular import
            QuantityHistory.objects.create(
                item=instance,
                change=new_quantity - old_quantity,
                note=f"Auto-logged: Quantity changed from {old_quantity} to {new_quantity}"
            )

        return super().update(instance, validated_data)



        
class TrackedItemRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrackedItemRecord
        fields = '__all__'

class QuantityHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = QuantityHistory
        fields = ['id', 'item', 'change', 'note', 'timestamp']

