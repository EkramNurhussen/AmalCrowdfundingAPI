# donations/serializers.py
from rest_framework import serializers
from .models import Donation
from accounts.serializers import UserSerializer
from campaigns.serializers import CampaignSerializer

class DonationSerializer(serializers.ModelSerializer):
    donor = UserSerializer(read_only=True)
    campaign = CampaignSerializer(read_only=True)

    class Meta:
        model = Donation
        fields = ['id', 'amount', 'anonymous', 'donor', 'campaign', 'created_at']
        read_only_fields = ['donor', 'campaign', 'created_at']