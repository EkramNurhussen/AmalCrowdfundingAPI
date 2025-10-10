# donations/views.py
from rest_framework import generics, permissions
from rest_framework.response import Response
from campaigns.models import Campaign
from .models import Donation
from .serializers import DonationSerializer
from django.shortcuts import get_object_or_404

class DonateView(generics.CreateAPIView):
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        campaign = get_object_or_404(Campaign, pk=self.kwargs['pk'])
        if self.request.data.get('amount', 0) <= 0:
            return Response({'error': 'Amount must be positive'}, status=400)
        if campaign.current_amount + self.request.data.get('amount', 0) > campaign.goal_amount:
            return Response({'error': 'Donation exceeds goal'}, status=400)
        serializer.save(donor=self.request.user, campaign=campaign)