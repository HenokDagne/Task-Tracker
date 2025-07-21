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
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated, BasePermission, AllowAny
from rest_framework.authentication import TokenAuthentication




def home(request):
    return render(request, 'todolist.html')


class ISAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.user and request.user.is_authenticated:
            return True
        else:
            return request.user.is_staff 

@method_decorator(csrf_exempt, name='dispatch')
class UserManagerViewSet(viewsets.ViewSet):

    @action(detail=False, methods=['get'], url_path='signup-page')
    def signup_page(self, request):
        # Render the signup.html template which includes signup.js
        return render(request, 'signup.html')
    
    @action(detail=False, methods=['post'], url_path='signup')
    def signup(self, request):
        # signup logic
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        if not username or not email or not password:
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
    @action(detail=False, methods=['get'], url_path='login-page')
    def login_page(self, request):
        # Render the login.html template which includes login.js
        return render(request, 'login.html')
    
    from django.views.decorators.csrf import csrf_exempt
    @csrf_exempt
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
        
    @action(detail=False, methods=['post'], url_path='logout', permission_classes=[IsAuthenticated])
    def logout(self, request):
        user = request.user
        if user.is_authenticated:
            try:
                token = Token.objects.get(user=user)
                token.delete()
                return Response({"message": "Logged out successfully"})
            except Token.DoesNotExist:
                pass
        
        return Response({"message": "No active session"}, status=400)    
         
    @action(detail=False, methods=['post'], url_path='is-exist')
    def isExist(self, request):
        username = request.data.get('username')
        if not username:
            return Response({"message": "Email is required"}, status=400)
        user_exists = User.objects.filter(Q(username=username)).exists()
        if user_exists:
            return Response({"message": "User exists"}, status=200)
        else:
            pass

    

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny]

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
    #permission_classes=[ISAdminOrReadOnly]


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['get'], url_path='profile-by-email')
    def searchBy_email(self, request, email):
        email = request.query_params.get('username')
        if not email:
            return Response({"message": "Email is required"}, status=400)
        try:
            profile = profile.objects.get(user__email=email)
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        except Profile.DoesNotExist:
            return Response({"message": "Profile not found"}, status=404)

        

















