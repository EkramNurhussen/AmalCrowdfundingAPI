# donations/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Donation

@receiver(post_save, sender=Donation)
def update_campaign_amount(sender, instance, created, **kwargs):
    if created:
        campaign = instance.campaign
        campaign.current_amount += instance.amount
        campaign.save()