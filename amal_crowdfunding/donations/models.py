# donations/models.py
from django.db import models
from django.conf import settings
from campaigns.models import Campaign

class Donation(models.Model):
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    anonymous = models.BooleanField(default=False)
    donor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='donations')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{'Anonymous' if self.anonymous else self.donor.username} donated {self.amount} to {self.campaign}"