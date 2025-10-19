from django.urls import path
from .views import DonationView, BackerHistoryView

urlpatterns = [
    path('campaigns/<int:campaign_id>/donate/', DonationView.as_view(), name='donate'),
    path('backer-history/', BackerHistoryView.as_view(), name='backer-history'),
]