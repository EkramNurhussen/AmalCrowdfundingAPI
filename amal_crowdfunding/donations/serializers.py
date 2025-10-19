from rest_framework import serializers
from .models import Donation
from campaigns.models import Campaign

class DonationSerializer(serializers.ModelSerializer):
    campaign = serializers.PrimaryKeyRelatedField(queryset=Campaign.objects.all())

    class Meta:
        model = Donation
        fields = ['id', 'user', 'campaign', 'amount', 'anonymous', 'created_at']
        read_only_fields = ['user', 'created_at']