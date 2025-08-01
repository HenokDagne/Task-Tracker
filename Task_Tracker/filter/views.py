
from django.shortcuts import render
from django.http import JsonResponse
from Task.models import Task
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

class TaskStatusViewSet(viewsets.ViewSet):
    permission_classes = []

    @action(detail=False, methods=['get'], url_path='total-tasks')
    def total_tasks(self, request):
        total_count = Task.objects.count()
        return Response({'total_tasks': total_count})

    @action(detail=False, methods=['get'], url_path='completed-count')
    def completed_count(self, request):
        count = Task.objects.filter(completed=True).count()
        return Response({'completed_tasks': count})

    @action(detail=False, methods=['get'], url_path='overdue-count')
    def overdue_count(self, request):
        now = timezone.now()
        count = Task.objects.filter(completed=False, Due_Date__lt=now).count()
        return Response({'overdue_tasks': count})

    @action(detail=False, methods=['get'], url_path='active-count')
    def active_count(self, request):
        now = timezone.now()
        count = Task.objects.filter(completed=False, Due_Date__gte=now).count()
        return Response({'active_tasks': count})
