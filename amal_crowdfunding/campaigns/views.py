# campaigns/views.py
from rest_framework import viewsets, permissions
from rest_framework.pagination import PageNumberPagination
from .models import Campaign
from .serializers import CampaignSerializer

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.creator == request.user

class StandardPagination(PageNumberPagination):
    page_size = 10

class CampaignViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.all().order_by('-created_at')
    serializer_class = CampaignSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    pagination_class = StandardPagination

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search', None)
        category_id = self.request.query_params.get('category', None)
        if search:
            queryset = queryset.filter(title__icontains=search) | queryset.filter(description__icontains=search)
        if category_id:
            queryset = queryset.filter(category__id=category_id)
        return queryset