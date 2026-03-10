from django.db import models

class Note(models.Model):
    title = models.CharField(max_length=255, default="Untitled")  # ✅ Default added
    content = models.TextField()  # Pehle 'body' tha
    created_at = models.DateTimeField(auto_now_add=True)  # Pehle 'created' tha
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
