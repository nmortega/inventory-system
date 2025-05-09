from django.db import models

class StorageLocation(models.Model):
    """
    Model representing a storage location.
    """
    name = models.CharField(max_length=255)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)
    create_date = models.DateTimeField(auto_now_add=True)
    modify_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class StorageMedium(models.Model):
    """
    Model representing a storage medium.
    """
    name = models.CharField(max_length=255)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)
    storage_location = models.ForeignKey(StorageLocation, on_delete=models.CASCADE)
    create_date = models.DateTimeField(auto_now_add=True)
    modify_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
class Item(models.Model):
    """
    Model representing an item.
    """
    name = models.CharField(max_length=255)
    storage_location = models.ForeignKey(StorageLocation, on_delete=models.CASCADE)
    storage_medium = models.ForeignKey(StorageMedium, on_delete=models.CASCADE)
    tracked = models.BooleanField(default=False)
    quantity = models.PositiveIntegerField(null=True, blank=True)
    codename = models.CharField(max_length=100, blank=True)
    archived = models.BooleanField(default=False)
    create_date = models.DateTimeField(auto_now_add=True)
    modify_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.codename})"

class TrackedItemRecord(models.Model):
    """
    Model representing a tracked item record.
    """
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    change = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)