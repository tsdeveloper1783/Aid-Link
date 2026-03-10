# backend/api/admin.py
from django.contrib import admin
import logging

logger = logging.getLogger(__name__)

# ==========================================
# Safe Import for Models
# ==========================================
try:
    from .models import Profile, ContactMessage, Donation, RecipientRequest, Note
    MODELS_IMPORTED = True
except Exception as e:
    # Agar models file replace ho rahi ho (inspectdb ke dauraan), crash se bacha lega
    Profile = ContactMessage = Donation = RecipientRequest = Note = None
    MODELS_IMPORTED = False
    logger.warning("⚠️ api.models import failed in admin.py (temporary). Error: %s", e)


# ==========================================
# Admin Classes
# ==========================================
if MODELS_IMPORTED:
    @admin.register(Profile)
    class ProfileAdmin(admin.ModelAdmin):
        list_display = ("user", "role", "phone", "created_at")
        list_filter = ("role", "created_at")
        search_fields = ("user__username", "user__email")

    @admin.register(ContactMessage)
    class ContactMessageAdmin(admin.ModelAdmin):
        list_display = ("name", "email", "subject", "created_at")
        search_fields = ("name", "email", "subject")
        list_filter = ("created_at",)

    @admin.register(Donation)
    class DonationAdmin(admin.ModelAdmin):
        list_display = ("donor", "amount", "status", "created_at")
        list_filter = ("status", "created_at")
        search_fields = ("donor__username", "donor__email")

    @admin.register(RecipientRequest)
    class RecipientRequestAdmin(admin.ModelAdmin):
        list_display = ("recipient", "title", "status", "created_at")
        list_filter = ("status", "created_at")
        search_fields = ("recipient__username", "title")

    @admin.register(Note)
    class NoteAdmin(admin.ModelAdmin):
        list_display = ("title", "user", "created_at")
        search_fields = ("title", "user__username")
        list_filter = ("created_at",)

else:
    logger.info("ℹ️ Admin registration skipped (models not imported, likely during inspectdb).")
