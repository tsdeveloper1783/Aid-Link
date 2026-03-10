from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import Profile


# Jab bhi naya User banta hai, Profile bhi auto-create ho jaye
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
        print(f"[SIGNAL] ✅ Profile created automatically for user: {instance.username}")


# Jab User update ho, to profile bhi save ho
@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if hasattr(instance, "profile"):
        instance.profile.save()
        print(f"[SIGNAL] 💾 Profile saved for user: {instance.username}")
