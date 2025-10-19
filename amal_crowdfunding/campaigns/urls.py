from django.urls import path
from .views import CategoryListView, CampaignListCreateView, CampaignDetailView, CommentListCreateView

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('campaigns/', CampaignListCreateView.as_view(), name='campaign-list-create'),
    path('campaigns/<int:pk>/', CampaignDetailView.as_view(), name='campaign-detail'),
    path('comments/', CommentListCreateView.as_view(), name='comment-list-create'),
]