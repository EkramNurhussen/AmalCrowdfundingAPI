from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.exceptions import PermissionDenied
from .models import Category, Campaign, Comment
from .serializers import CategorySerializer, CampaignSerializer, CommentSerializer
from django.db.models import Q

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]  # Allow unauthenticated access

class CampaignListCreateView(generics.ListCreateAPIView):
    serializer_class = CampaignSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Campaign.objects.all()
        search = self.request.query_params.get('search', None)
        category = self.request.query_params.get('category', None)
        if search:
            queryset = queryset.filter(Q(title__icontains=search) | Q(description__icontains=search))
        if category:
            queryset = queryset.filter(category_id=category)
        return queryset

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

class CampaignDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_destroy(self, instance):
        if instance.creator == self.request.user:
            instance.delete()
        else:
            raise PermissionDenied("Only the creator can delete this campaign.")

class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        campaign_id = self.request.query_params.get('campaign', None)
        if campaign_id:
            return Comment.objects.filter(campaign_id=campaign_id)
        return Comment.objects.all()

    def perform_create(self, serializer):
        campaign_id = self.request.data.get('campaign')
        serializer.save(user=self.request.user, campaign_id=campaign_id)