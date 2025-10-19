from rest_framework import serializers
from .models import Category, Campaign, Comment

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class CampaignSerializer(serializers.ModelSerializer):
    progress = serializers.SerializerMethodField()

    class Meta:
        model = Campaign
        fields = ['id', 'creator', 'title', 'description', 'goal_amount', 'current_amount', 'created_at', 'end_date', 'category', 'progress']

    def get_progress(self, obj):
        return (obj.current_amount / obj.goal_amount * 100) if obj.goal_amount > 0 else 0

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Comment
        fields = ['id', 'campaign', 'user', 'content', 'created_at']