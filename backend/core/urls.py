from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'storage-locations', StorageLocationViewSet)
router.register(r'storage-mediums', StorageMediumViewSet)
router.register(r'items', ItemViewSet)
router.register(r'tracked-items', TrackedItemRecordViewSet)

urlpatterns = [
    path('', include(router.urls)),
]