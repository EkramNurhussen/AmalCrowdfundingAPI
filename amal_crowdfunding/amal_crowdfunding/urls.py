from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('accounts.urls')),
    path('api/', include('campaigns.urls')),
    path('api/', include('donations.urls')),
    path('', TemplateView.as_view(template_name='index.html'), name='index'),
    path('register/', TemplateView.as_view(template_name='register.html'), name='register'),
    path('login/', TemplateView.as_view(template_name='login.html'), name='login'),
    path('profile/', TemplateView.as_view(template_name='profile.html'), name='profile'),
    path('dashboard/', TemplateView.as_view(template_name='dashboard.html'), name='dashboard'),
    path('create_campaign/', TemplateView.as_view(template_name='create_campaign.html'), name='create_campaign'),
    path('campaign/<int:id>/', TemplateView.as_view(template_name='campaign.html'), name='campaign'),
    path('donate/<int:id>/', TemplateView.as_view(template_name='donate.html'), name='donate'),
    path('comment/<int:id>/', TemplateView.as_view(template_name='comment.html'), name='comment'),
    path('backer_history/', TemplateView.as_view(template_name='backer_history.html'), name='backer_history'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)