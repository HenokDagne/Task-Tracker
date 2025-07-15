# serializers.py
from rest_framework import serializers
from .models import Task, Profile, Category



class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile 
        fields = ['id', 'user', 'phone', 'bio', 'Profile_picture']



class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

        

class TaskSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    class Meta:
        model = Task
        fields = ['id', 'title', 'description','created_at', 'updated_at','progress', 'completed', 'status', 'finished_at', 'Category', 'profile']

    def get_status(self, obj):
        return obj.get_status()    


