from django.db import models
from django.conf import settings

class Category(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name

class Campaign(models.Model):
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    goal_amount = models.DecimalField(max_digits=10, decimal_places=2)
    current_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    end_date = models.DateField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    def __str__(self):
        return self.title

class Comment(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.user.username} on {self.campaign.title}"