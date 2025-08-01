from django.contrib.auth.models import User
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=15, null=True)
    bio = models.TextField(null=True, blank=True)
    Profile_picture = models.ImageField(upload_to='images/', default='images/default.jpg')
    

    def __str__(self):
        return self.user.email + self.user.username
    

class Category(models.Model):
    WORK = 'Wrok'
    PERSONAL = 'Personal'
    DEVELOPMENT = 'Development'
    HEALTH = 'Health'
    FINANCE = 'Finance'
    STUDY = 'Study'
    Other = 'Other'
    category = {
        WORK: 'Work',
        PERSONAL: 'Personal',
        STUDY: 'Study',
        DEVELOPMENT: 'Development',
        HEALTH: 'Health',
        FINANCE: 'Finance',
        Other: 'Other'  
    }
    name = models.CharField(
        max_length=150, 
        unique=True, default="other", 
        blank=True, 
        choices=category,
        )
        
    
class Task(models.Model):
    Category = models.ManyToManyField(Category, blank=True)
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    title = models.CharField(max_length=150)
    Due_Date = models.DateTimeField() 
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    progress = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(10)])
    completed = models.BooleanField(default=False)

    def get_status(self):
        from django.utils import timezone
        now = timezone.now()
        # If progress is 10, set completed True and return 'completed'
        if self.progress == 10:
            if not self.completed:
                self.completed = True
                self.save(update_fields=['completed'])
            return 'completed'
        if self.completed:
            return 'completed'
        elif now > self.Due_Date:
            return 'overdue'
        else:
            return 'active'




