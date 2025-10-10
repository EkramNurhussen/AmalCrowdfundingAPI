# amal_crowdfunding/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse

def root_view(request):
    return HttpResponse("Welcome to Amal Crowdfunding API. Visit /api/ for endpoints.")

urlpatterns = [
    path('', root_view, name='root'),
    path('admin/', admin.site.urls),
    path('api/', include('accounts.urls')),
    path('api/', include('campaigns.urls')),
    path('api/', include('donations.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)