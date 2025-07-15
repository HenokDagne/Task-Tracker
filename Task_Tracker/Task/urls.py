# filepath: c:\Users\hp\OneDrive\Desktop\DjangoProject\Task-Tracker\Task_Tracker\Task\urls.py
from rest_framework.routers import DefaultRouter
from .views import UserManagerViewSet, TaskViewSet, CategoryViewSet, ProfileViewSet
from django.urls import path
from .views import home

router = DefaultRouter()
router.register(r'user', UserManagerViewSet, basename='user')#http://127.0.0.1:8000/user
router.register(r'task', TaskViewSet, basename='task')#http://127.0.0.1:8000/task
router.register(r'category', CategoryViewSet, basename='category')#http://127.0.0.1:8000/category
router.register(r'profile', ProfileViewSet, basename='profile')#http://127.0.0.1:8000/profile
urlpatterns = router.urls
urlpatterns += [
    path('home/', home, name='home'),
]