from django.db import models
from django.conf import settings
from campaigns.models import Campaign

class Donation(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    anonymous = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} donated {self.amount} to {self.campaign.title}"