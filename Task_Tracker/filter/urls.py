from rest_framework.routers import DefaultRouter
from filter.views import TaskStatusViewSet
from django.urls import path


router = DefaultRouter()
router.register(r'task-status', TaskStatusViewSet, basename='task-status')  # http://127.0.0.1:8000/filter/
urlpatterns = router.urls
