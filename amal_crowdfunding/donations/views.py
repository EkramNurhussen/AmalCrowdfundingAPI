from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from .models import Donation
from .serializers import DonationSerializer
from campaigns.models import Campaign

class DonationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, campaign_id):
        try:
            campaign = Campaign.objects.get(id=campaign_id)
        except Campaign.DoesNotExist:
            return Response({"error": "Campaign not found"}, status=status.HTTP_404_NOT_FOUND)
        
        data = request.data.copy()
        data['campaign'] = campaign_id
        data['user'] = request.user.id
        serializer = DonationSerializer(data=data)
        if serializer.is_valid():
            donation = serializer.save()
            campaign.current_amount += donation.amount
            campaign.save()
            return Response({"message": "Donation successful"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BackerHistoryView(generics.ListAPIView):
    serializer_class = DonationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Donation.objects.filter(user=self.request.user)