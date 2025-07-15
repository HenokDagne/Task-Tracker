from django.contrib import admin
from Task.models import Profile, Task, Category

# Register your models here.
@admin.register(Profile)

class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user__email', 'user__username', 'phone', 'bio', 'Profile_picture')
    list_editable = ('phone', 'bio', 'Profile_picture')
    search_fields = ('user__email', 'user__username', 'phone')
    list_filter = ('user__is_active', 'user__email')

@admin.register(Task)    
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'profile', 'finished_at', 'created_at', 'updated_at', 'progress', 'completed', 'get_categories')
    list_editable = ('finished_at', 'progress', 'completed')    
    search_fields = ('title',)
    list_filter = ('title', 'profile__user__email')

    def get_categories(self, obj):
        return ", ".join([cat.name for cat in obj.Category.all()])
    get_categories.short_description = 'Categories'


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    list_editable = ('name',)
    search_fields = ('name',)
    list_filter = ('name',)



