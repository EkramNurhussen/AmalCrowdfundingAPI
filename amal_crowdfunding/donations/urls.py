# donations/urls.py
from django.urls import path
from .views import DonateView

urlpatterns = [
    path('campaigns/<int:pk>/donate/', DonateView.as_view(), name='donate'),
]