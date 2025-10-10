# campaigns/serializers.py
from rest_framework import serializers
from .models import Campaign, Category
from accounts.serializers import UserSerializer

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class CampaignSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), source='category', write_only=True)
    progress = serializers.SerializerMethodField()

    class Meta:
        model = Campaign
        fields = ['id', 'title', 'description', 'goal_amount', 'current_amount', 'end_date', 'creator', 'category', 'category_id', 'image', 'created_at', 'updated_at', 'progress']
        read_only_fields = ['creator', 'current_amount', 'created_at', 'updated_at']

    def get_progress(self, obj):
        return (obj.current_amount / obj.goal_amount * 100) if obj.goal_amount > 0 else 0