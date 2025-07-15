from django.shortcuts import render
from rest_framework import viewsets
from .models import Task, Profile, Category
from .serializers import TaskSerializer, ProfileSerializer, CategorySerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from rest_framework.decorators import action
from django.utils.decorators import method_decorator
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator



def home(request):
    return render(request, 'todolist.html')

@method_decorator(csrf_exempt, name='dispatch')
class UserManagerViewSet(viewsets.ViewSet):

    @action(detail=False, methods=['post'], url_path='signup')
    def signup(self, request):
        # signup logic
        if request.method == 'POST':
            username = request.data.get('username')
            email = request.data.get('email')
            password = request.data.get('password')
            first_name = request.data.get('first_name')
            last_name = request.data.get('last_name')
            if not username or not  email or not password:
                return Response({"message": "Missing required fields"}, status=400)
            if User.objects.filter(email=email).exists():
                return Response({"message": "Email already exists"}, status=400)
            user = User.objects.create_user(username=username, email=email, password=password, first_name=first_name, last_name=last_name)
            user.save()
            if user:
                profile = Profile.objects.create(user=user)
                profile.save()
                return Response({"message": "User created successfully"})
            else:
                return Response({"message": "User creation failed"}, status=400)
               

    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        if not email or not password:
            return Response({"message": "Email and password are required"}, status=400)
        try:
            user_object = User.objects.get(email=email)
            user = authenticate(username=user_object.username, password=password)
        except User.DoesNotExist:
            return Response({"message": "User does not exist"}, status=404)
        if user is not None:

            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key})
            
        else:
            return Response({"message": "Invalid credentials"}, status=400)
        
    @action(detail=False, methods=['post'])
    def logout(self, request):
        token = request.auth
        if token:
            token.delete()
            return Response({"message": "Logged out successfully"})
        return Response({"message": "No active session"}, status=400)    
        

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    @action(detail=False, methods=['get'], url_path='task-by-name')
    def searchBy_name(self, request):
        name = request.query_params.get('name')
        if not name:
            return Response({"message": "Name is required"}, status=400)
        tasks = Task.objects.filter(title__icontains=name)
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)
        

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    @action(detail=True, methods=['get'], url_path='profile-by-email')
    def searchBy_email(self, request, email):
        email = request.query_params.get('email')
        if not email:
            return Response({"message": "Email is required"}, status=400)
        try:
            profile = profile.objects.get(user__email=email)
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        except Profile.DoesNotExist:
            return Response({"message": "Profile not found"}, status=404)

        

















