from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password, check_password


# Custom User Manager for your PostgreSQL users table
class CustomUserManager(models.Manager):
    def create_user(self, username, email, password, role='donor', **extra_fields):
        """
        Creates and saves a User in your custom PostgreSQL users table
        """
        from django.db import connection
        
        with connection.cursor() as cursor:
            # Get role_id
            if role == 'donor':
                role_id = 1
            else:  # recipient
                role_id = 2
                
            # Hash password
            password_hash = make_password(password)
            
            # Insert into users table
            cursor.execute("""
                INSERT INTO users (full_name, email, password_hash, role_id, phone_number, is_active) 
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING user_id
            """, [username, email, password_hash, role_id, extra_fields.get('phone', ''), True])
            
            user_id = cursor.fetchone()[0]
            
            # Insert into user_profiles table
            cursor.execute("""
                INSERT INTO user_profiles (user_id, address, city, agreed_terms) 
                VALUES (%s, %s, %s, %s)
            """, [user_id, extra_fields.get('address', ''), extra_fields.get('city', ''), True])
            
            # If donor, insert into donor_profiles
            if role == 'donor':
                cursor.execute("""
                    INSERT INTO donor_profiles (user_id, city, verified) 
                    VALUES (%s, %s, %s)
                """, [user_id, extra_fields.get('city', ''), False])
            
            # If recipient, insert into recipient_profiles  
            elif role == 'recipient':
                cursor.execute("""
                    INSERT INTO recipient_profiles (user_id, full_name, email, phone, city, address, verified) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, [user_id, username, email, extra_fields.get('phone', ''), 
                      extra_fields.get('city', ''), extra_fields.get('address', ''), False])
        
        return user_id


class Donation(models.Model):
    donor_name = models.CharField(max_length=100, default="Unknown Donor")
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    date = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=20, default="Pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.donor_name} - {self.amount}"


class Profile(models.Model):
    ROLE_CHOICES = [
        ('donor', 'Donor'),
        ('recipient', 'Recipient'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    name = models.CharField(max_length=100, default="Unknown User")
    email = models.EmailField(default="unknown@example.com")
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="donor")
    profile_picture = models.ImageField(upload_to="profiles/", blank=True, null=True)

    def __str__(self):
        return self.name


# ✅ UPDATED: Recipient Profile Model with COMPLETE PROFILE LOGIC
class RecipientProfile(models.Model):
    URGENCY_LEVELS = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
        ('Urgent', 'Urgent'),
    ]
    
    CATEGORY_CHOICES = [
        ('Medical', 'Medical Emergency'),
        ('Education', 'Education Support'),
        ('Food', 'Food & Basic Needs'),
       
        ('Orphans', 'Orphan Support'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='recipient_profile')
    fullName = models.CharField(max_length=100)
    email = models.EmailField()
    phoneNumber = models.CharField(max_length=15)
    address = models.TextField()
    profilePicture = models.ImageField(upload_to='recipient_profiles/', null=True, blank=True)
    fatherName = models.CharField(max_length=100, blank=True)
    familyMembers = models.IntegerField(default=0)
    previousJob = models.CharField(max_length=100, blank=True)
    urgencyLevel = models.CharField(max_length=20, choices=URGENCY_LEVELS, default='Medium')
    about = models.TextField(blank=True)
    
    # ✅ NEW FIELDS FOR PROFILE COMPLETION
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, blank=True)
    required_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    story = models.TextField(blank=True, help_text="Detailed reason for needing donation")
    
    isVerified = models.BooleanField(default=False)
    is_profile_complete = models.BooleanField(default=False)
    is_visible_to_donors = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.fullName} - Recipient Profile"

    def save(self, *args, **kwargs):
        # ✅ AUTO-CHECK IF PROFILE IS COMPLETE
        required_fields = [
            self.fullName, self.email, self.phoneNumber, self.address,
            self.category, self.required_amount, self.story
        ]
        
        # Check if all required fields are filled
        self.is_profile_complete = all(required_fields) and bool(self.story.strip())
        
        # Auto-activate for donors if profile is complete
        self.is_visible_to_donors = self.is_profile_complete
        
        super().save(*args, **kwargs)


class RecipientRequest(models.Model):
    recipient = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="requests", null=True, blank=True
    )
    recipient_name = models.CharField(max_length=100, default="Unknown Recipient")
    reason = models.TextField(default="Not specified")
    status = models.CharField(max_length=20, default="Pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.recipient_name


class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    body = models.TextField()

    def __str__(self):
        return f"Message from {self.name}"


# Custom User model that works with your PostgreSQL tables
class CustomUser(models.Model):
    objects = CustomUserManager()
    
    class Meta:
        managed = False  # This tells Django not to manage this table
        db_table = 'users'