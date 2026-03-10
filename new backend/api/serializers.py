from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, ContactMessage, Donation, RecipientRequest, RecipientProfile


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data.get('password'),
            email=validated_data.get('email', '')
        )
        return user


class ProfileSerializer(serializers.ModelSerializer):
    # show username/email read-only (belongs to related User)
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Profile
        fields = (
            "id",
            "username",
            "email",
            "role",
            "phone",
            "address",
        )
        read_only_fields = ("id", "username", "email", "role")


# ✅ UPDATED: Recipient Profile Serializer with new fields
class RecipientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipientProfile
        fields = '__all__'
        read_only_fields = ('user', 'isVerified', 'is_profile_complete', 'is_visible_to_donors', 'created_at', 'updated_at')


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = "__all__"


class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = "__all__"
        read_only_fields = ['created_at', 'updated_at']


class RecipientRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipientRequest
        fields = "__all__"
        read_only_fields = ['created_at', 'updated_at']


# ✅ ADDED: Custom Login Serializer for PostgreSQL Authentication
class CustomTokenObtainPairSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")
        
        # First try to authenticate with custom PostgreSQL database
        user_id = self.authenticate_custom_user(username, password)
        
        if user_id:
            # Get user role from custom database
            role = self.get_user_role(user_id)
            
            # Also ensure user exists in Django auth system
            django_user, created = User.objects.get_or_create(
                username=username,
                defaults={'email': username if '@' in username else ''}
            )
            if created:
                django_user.set_password(password)
                django_user.save()
            
            # Create profile if not exists
            profile, created = Profile.objects.get_or_create(
                user=django_user,
                defaults={
                    'name': username,
                    'email': username if '@' in username else '',
                    'role': role
                }
            )
            
            # Generate tokens
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh = RefreshToken.for_user(django_user)
            refresh['role'] = role
            access_token = refresh.access_token
            access_token['role'] = role
            
            return {
                'refresh': str(refresh),
                'access': str(access_token),
                'role': role,
                'user': {
                    'id': user_id,
                    'username': username,
                    'email': username if '@' in username else '',
                    'role': role
                }
            }
        else:
            raise serializers.ValidationError("Invalid credentials")

    def authenticate_custom_user(self, username, password):
        """Authenticate against custom PostgreSQL users table"""
        from django.db import connection
        from django.contrib.auth.hashers import check_password
        
        try:
            with connection.cursor() as cursor:
                # Check if username is email or actual username
                if '@' in username:
                    cursor.execute("SELECT user_id, password_hash FROM users WHERE email = %s AND is_active = true", [username])
                else:
                    cursor.execute("SELECT user_id, password_hash FROM users WHERE full_name = %s AND is_active = true", [username])
                
                result = cursor.fetchone()
                if result:
                    user_id, password_hash = result
                    if check_password(password, password_hash):
                        return user_id
            return None
        except Exception as e:
            print(f"Auth error: {e}")
            return None

    def get_user_role(self, user_id):
        """Get user role from custom database"""
        from django.db import connection
        
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT r.role_name 
                    FROM users u 
                    JOIN roles r ON u.role_id = r.role_id 
                    WHERE u.user_id = %s
                """, [user_id])
                result = cursor.fetchone()
                return result[0] if result else 'donor'
        except:
            return 'donor'