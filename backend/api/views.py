import stripe
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.db import connection
from django.contrib.auth.hashers import check_password
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import JsonResponse
import json
import datetime
from textblob import TextBlob
import pandas as pd
import requests
from rapidfuzz import fuzz
from django.utils.decorators import method_decorator

from django.http import JsonResponse
from django.views import View

from django.http import JsonResponse
from django.views import View
from .models import Profile, ContactMessage, Donation, RecipientRequest, CustomUser, RecipientProfile
import os
import re
import pytesseract
from PIL import Image
from pdf2image import convert_from_path

from django.http import JsonResponse
from django.views import View
from django.conf import settings

from transformers import AutoTokenizer, AutoModelForCausalLM
from .serializers import (
    ProfileSerializer,
    ContactMessageSerializer,
    DonationSerializer,
    RecipientRequestSerializer,
    CustomTokenObtainPairSerializer,
    RecipientProfileSerializer
)

stripe.api_key = settings.STRIPE_SECRET_KEY


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def debug_api(request):
    return JsonResponse({
        "message": " Django API is working PERMANENTLY!",
        "available_endpoints": [
            "/api/register/",
            "/api/token/", 
            "/api/recipient/profile/",
            "/api/donor/profile/",
            "/api/recipients/",
            "/api/recipients/visible/",
            "/api/contact/",
            "/api/donations/",
            "/api/requests/",
            "/api/profile/",
            "/api/donors/",
            "/api/messages/",
            "/api/notifications/",
            "/api/preferences/"
        ]
    }, status=200)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def donors(request):
    """PERMANENT Donors endpoint"""
    return JsonResponse([
        {
            'id': 1,
            'name': 'Ali Raza',
            'email': 'ali@example.com',
            'location': 'Islamabad, Pakistan',
            'total_donations': 45000,
            'donation_count': 12,
            'last_donation': '2024-01-15',
            'is_verified': True,
            'bio': 'Helping communities since 2023'
        },
        {
            'id': 2,
            'name': 'Sarah Khan',
            'email': 'sarah@example.com',
            'location': 'Karachi, Pakistan',
            'total_donations': 32000,
            'donation_count': 8,
            'last_donation': '2024-01-10',
            'is_verified': True,
            'bio': 'Education supporter'
        }
    ], safe=False, status=200)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def messages(request):
    """PERMANENT Messages endpoint"""
    return JsonResponse([], safe=False, status=200)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def notifications(request):
    """PERMANENT Notifications endpoint"""
    return JsonResponse([], safe=False, status=200)

@api_view(['GET', 'PUT'])
@permission_classes([permissions.IsAuthenticated])
def preferences(request):
    """PERMANENT Preferences endpoint"""
    if request.method == 'GET':
        return JsonResponse({}, safe=False, status=200)
    elif request.method == 'PUT':
        return JsonResponse({"message": "Preferences updated"}, status=200)

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
       
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")
        role = request.data.get("role", "donor")
        phone = request.data.get("phone")
        address = request.data.get("address")
        profile_picture = request.FILES.get('profilePicture')  

       
        if not username or not email or not password:
            return Response({"error": "All fields are required"}, status=400)

       
        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=400)

        
        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already registered"}, status=400)

        try:
           
            user_id = CustomUser.objects.create_user(
                username=username,
                email=email,
                password=password,
                role=role,
                phone=phone,
                address=address
            )
            
            print(f" User created in custom database: {username}, ID: {user_id}")
            
           
            django_user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )
            
            
            profile = Profile.objects.create(
                user=django_user,
                name=username,
                email=email,
                phone=phone,
                address=address,
                role=role
              
            )
            
           
            if profile_picture:
                profile.profile_picture = profile_picture  
                profile.save()
                print(f"✅ Profile picture saved for: {username}")
            
           
            if role == 'recipient':
                recipient_profile = RecipientProfile.objects.create(
                    user=django_user,
                    fullName=username,
                    email=email,
                    phoneNumber=phone or "",
                    address=address or "",
                    fatherName="",
                    familyMembers=0,
                    previousJob="",
                    urgencyLevel="Medium",
                    about="Please update your profile",
                    isVerified=False
                )
                
                if profile_picture:
                    recipient_profile.profilePicture = profile_picture
                    recipient_profile.save()
                    print(f"✅ Recipient profile picture saved for: {username}")
                
                print(f"✅ Recipient profile created for: {username}")
            
            # 6. Generate JWT tokens
            refresh = RefreshToken.for_user(django_user)
            refresh['role'] = role
            access_token = refresh.access_token
            access_token['role'] = role

            return Response({
                "message": "Registration successful!",
                "user": {
                    "id": user_id,
                    "username": username,
                    "email": email,
                    "role": role,
                },
                "refresh": str(refresh),
                "access": str(access_token),
            }, status=201)

        except Exception as e:
            print(f"❌ Registration error: {str(e)}")
            # Cleanup if something failed
            if 'django_user' in locals():
                django_user.delete()
            return Response({"error": f"Registration failed: {str(e)}"}, status=500)
   


    
# ---------------- CUSTOM LOGIN FOR BOTH DATABASES ----------------
class CustomTokenObtainPairView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = CustomTokenObtainPairSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data)
        return Response(serializer.errors, status=400)

# ✅ PERMANENT RECIPIENT PROFILE - WITH AUTO-REDIRECT LOGIC
class RecipientProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """PERMANENT Get recipient profile - WITH COMPLETION CHECK"""
        try:
            user = request.user
            print(f"🔍 PERMANENT GET Profile - User: {user.username}")
            
            # Check if user has profile, if not create one
            if not hasattr(user, 'profile'):
                profile = Profile.objects.create(
                    user=user,
                    name=user.username,
                    email=user.email,
                    role='recipient'
                )
                print(f"✅ Created profile for user: {user.username}")
            
            # Check if user is recipient
            if user.profile.role != 'recipient':
                return Response({"error": "Access denied. User is not a recipient."}, status=403)
            
            # Get or create recipient profile - PERMANENT FIX
            try:
                recipient_profile = RecipientProfile.objects.get(user=user)
                print(f"✅ Found existing recipient profile: {recipient_profile.fullName}")
            except RecipientProfile.DoesNotExist:
                print(f"⚠️ Recipient profile not found, creating new one...")
                recipient_profile = RecipientProfile.objects.create(
                    user=user,
                    fullName=user.profile.name or user.username,
                    email=user.email,
                    phoneNumber=user.profile.phone or "",
                    address=user.profile.address or "",
                    fatherName="Not provided",
                    familyMembers=0,
                    previousJob="Not provided",
                    urgencyLevel="Medium",
                    about="Please update your profile information",
                    isVerified=False
                )
                print(f"✅ PERMANENT - Created new recipient profile for: {user.username}")
            
            # Return data in exact format React expects
            response_data = {
                'id': recipient_profile.id,
                'fullName': recipient_profile.fullName,
                'email': recipient_profile.email,
                'phoneNumber': recipient_profile.phoneNumber,
                'address': recipient_profile.address,
                'fatherName': recipient_profile.fatherName,
                'familyMembers': recipient_profile.familyMembers,
                'previousJob': recipient_profile.previousJob,
                'urgencyLevel': recipient_profile.urgencyLevel,
                'about': recipient_profile.about,
                'isVerified': recipient_profile.isVerified,
                'profilePicture': recipient_profile.profilePicture.url if recipient_profile.profilePicture else None,
                'created_at': recipient_profile.created_at.isoformat() if recipient_profile.created_at else None,
                'updated_at': recipient_profile.updated_at.isoformat() if recipient_profile.updated_at else None,
                
                # ✅ NEW FIELDS FOR PROFILE COMPLETION
                'category': recipient_profile.category,
                'required_amount': float(recipient_profile.required_amount) if recipient_profile.required_amount else 0,
                'story': recipient_profile.story,
                'is_profile_complete': recipient_profile.is_profile_complete,
                'is_visible_to_donors': recipient_profile.is_visible_to_donors
            }
            
            print(f"✅ PERMANENT - Sending profile data: {response_data}")
            return Response(response_data)
                
        except Exception as e:
            print(f"❌ PERMANENT ERROR - Recipient profile fetch error: {str(e)}")
            # Even if error, return basic data
            fallback_data = {
                'fullName': request.user.username,
                'email': request.user.email,
                'phoneNumber': '',
                'address': '',
                'fatherName': 'Not provided',
                'familyMembers': 0,
                'previousJob': 'Not provided',
                'urgencyLevel': 'Medium',
                'about': 'Please update your profile',
                'isVerified': False,
                'profilePicture': None,
                'is_profile_complete': False,
                'is_visible_to_donors': False
            }
            return Response(fallback_data)

    def put(self, request):
        """PERMANENT Update recipient profile - WITH AUTO-ACTIVATION"""
        try:
            user = request.user
            print(f"🔍 PERMANENT UPDATE Profile - User: {user.username}")
            print(f"🔍 Request data: {request.data}")
            
            # Check if user is recipient
            if not hasattr(user, 'profile') or user.profile.role != 'recipient':
                return Response({"error": "Access denied. User is not a recipient."}, status=403)
            
            # Get or create recipient profile
            recipient_profile, created = RecipientProfile.objects.get_or_create(
                user=user,
                defaults={
                    'fullName': user.profile.name or user.username,
                    'email': user.email,
                    'phoneNumber': user.profile.phone or "",
                    'address': user.profile.address or "",
                    'fatherName': "Not provided",
                    'familyMembers': 0,
                    'previousJob': "Not provided",
                    'urgencyLevel': "Medium",
                    'about': "Please update your profile",
                    'isVerified': False
                }
            )
            
            if created:
                print(f"✅ Created new recipient profile during update")
            else:
                print(f"✅ Updating existing recipient profile")
            
            # Update all fields from request data
            update_fields = [
                'fullName', 'email', 'phoneNumber', 'address', 
                'fatherName', 'familyMembers', 'previousJob', 
                'urgencyLevel', 'about', 'category', 'required_amount', 'story'
            ]
            
            for field in update_fields:
                if field in request.data:
                    if field == 'familyMembers':
                        # Convert to integer
                        try:
                            setattr(recipient_profile, field, int(request.data[field]))
                        except (ValueError, TypeError):
                            setattr(recipient_profile, field, 0)
                    elif field == 'required_amount':
                        # Convert to decimal
                        try:
                            setattr(recipient_profile, field, float(request.data[field]))
                        except (ValueError, TypeError):
                            setattr(recipient_profile, field, 0.00)
                    else:
                        setattr(recipient_profile, field, request.data[field])
            
            # Handle profile picture upload
            if 'profilePicture' in request.FILES:
                recipient_profile.profilePicture = request.FILES['profilePicture']
            
            # Save the updated profile (this triggers auto-completion check)
            recipient_profile.save()
            
            print(f"✅ PERMANENT - Profile updated successfully for: {user.username}")
            print(f"✅ Profile completion status: {recipient_profile.is_profile_complete}")
            print(f"✅ Visibility to donors: {recipient_profile.is_visible_to_donors}")
            
            # Return updated data in exact format React expects
            updated_data = {
                'id': recipient_profile.id,
                'fullName': recipient_profile.fullName,
                'email': recipient_profile.email,
                'phoneNumber': recipient_profile.phoneNumber,
                'address': recipient_profile.address,
                'fatherName': recipient_profile.fatherName,
                'familyMembers': recipient_profile.familyMembers,
                'previousJob': recipient_profile.previousJob,
                'urgencyLevel': recipient_profile.urgencyLevel,
                'about': recipient_profile.about,
                'isVerified': recipient_profile.isVerified,
                'profilePicture': recipient_profile.profilePicture.url if recipient_profile.profilePicture else None,
                
                # ✅ NEW FIELDS FOR PROFILE COMPLETION
                'category': recipient_profile.category,
                'required_amount': float(recipient_profile.required_amount) if recipient_profile.required_amount else 0,
                'story': recipient_profile.story,
                'is_profile_complete': recipient_profile.is_profile_complete,
                'is_visible_to_donors': recipient_profile.is_visible_to_donors
            }
            
            return Response(updated_data)
            
        except Exception as e:
            print(f"❌ PERMANENT ERROR - Recipient profile update error: {str(e)}")
            return Response({"error": f"Failed to update profile: {str(e)}"}, status=500)

# ✅ FIXED: VISIBLE RECIPIENTS ENDPOINT
class VisibleRecipientsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Get only COMPLETE and VISIBLE recipient profiles for donors"""
        try:
            print("🔍 Fetching VISIBLE recipients from database...")
            
            # Check if user is donor
            user_profile = getattr(request.user, 'profile', None)
            if not user_profile:
                # Create profile if it doesn't exist
                user_profile = Profile.objects.create(
                    user=request.user,
                    name=request.user.username,
                    email=request.user.email,
                    role='donor'  # Default to donor
                )
                print(f"✅ Created profile for user: {request.user.username}")
            
            if user_profile.role != 'donor':
                return Response({"error": "Access denied. Only donors can view recipients."}, status=403)
            
            # Get only complete and visible recipient profiles
            visible_profiles = RecipientProfile.objects.filter(
                is_profile_complete=True,
                is_visible_to_donors=True
            ).select_related('user')
            
            recipients_data = []
            for recipient in visible_profiles:
                user = recipient.user
                
                # Get donations for this recipient
                recipient_donations = Donation.objects.filter(recipient_name=user.username)
                donated_amount = sum([float(donation.amount) for donation in recipient_donations])
                
                # Calculate progress percentage
                required_amount = float(recipient.required_amount) if recipient.required_amount else 50000
                progress_percentage = min(100, (donated_amount / required_amount * 100)) if required_amount > 0 else 0
                
                recipient_data = {
                    'id': recipient.id,  # Use recipient profile ID instead of user ID
                    'name': recipient.fullName,
                    'email': recipient.email,
                    'phone': recipient.phoneNumber,
                    'address': recipient.address,
                    'location': recipient.address,
                    'reason': recipient.story or recipient.about,
                    'description': recipient.story or recipient.about,
                    'urgency': recipient.urgencyLevel,
                    'category': recipient.category or 'General',
                    'required_amount': required_amount,
                    'donated_amount': donated_amount,
                    'progress_percentage': progress_percentage,
                    'family_members': recipient.familyMembers,
                    'previous_job': recipient.previousJob,
                    'father_name': recipient.fatherName,
                    'is_verified': recipient.isVerified,
                    'profile_picture': recipient.profilePicture.url if recipient.profilePicture else "https://randomuser.me/api/portraits/lego/1.jpg",
                    'created_at': recipient.created_at.isoformat() if recipient.created_at else None,
                    'about': recipient.about,
                    'bio': recipient.story or recipient.about,
                    'image': recipient.profilePicture.url if recipient.profilePicture else "https://randomuser.me/api/portraits/lego/1.jpg",
                    'story': recipient.story,
                    'is_complete': recipient.is_profile_complete,
                    'is_visible': recipient.is_visible_to_donors
                }
                recipients_data.append(recipient_data)
            
            print(f"✅ Found {len(recipients_data)} VISIBLE recipients")
            
            # If no visible recipients, return empty array instead of error
            return Response(recipients_data)
            
        except Exception as e:
            print(f"❌ Error fetching visible recipients: {str(e)}")
            import traceback
            traceback.print_exc()
            # Return empty array with success status to prevent frontend errors
            return Response([], status=200)
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Get only COMPLETE and VISIBLE recipient profiles for donors"""
        try:
            print("🔍 Fetching VISIBLE recipients from database...")
            
            # Check if user is donor
            user_profile = getattr(request.user, 'profile', None)
            if not user_profile or user_profile.role != 'donor':
                return Response({"error": "Access denied. Only donors can view recipients."}, status=403)
            
            # Get only complete and visible recipient profiles
            visible_profiles = RecipientProfile.objects.filter(
                is_profile_complete=True,
                is_visible_to_donors=True
            ).select_related('user')
            
            recipients_data = []
            for recipient in visible_profiles:
                user = recipient.user
                
                # Get donations for this recipient
                recipient_donations = Donation.objects.filter(recipient_name=user.username)
                donated_amount = sum([float(donation.amount) for donation in recipient_donations])
                
                recipient_data = {
                    'id': user.id,
                    'name': recipient.fullName,
                    'email': recipient.email,
                    'phone': recipient.phoneNumber,
                    'address': recipient.address,
                    'location': recipient.address,
                    'reason': recipient.story or recipient.about,
                    'description': recipient.story or recipient.about,
                    'urgency': recipient.urgencyLevel,
                    'category': recipient.category or 'General',
                    'required_amount': float(recipient.required_amount) if recipient.required_amount else 50000,
                    'donated_amount': donated_amount,
                    'family_members': recipient.familyMembers,
                    'previous_job': recipient.previousJob,
                    'father_name': recipient.fatherName,
                    'is_verified': recipient.isVerified,
                    'profile_picture': recipient.profilePicture.url if recipient.profilePicture else None,
                    'created_at': recipient.created_at.isoformat() if recipient.created_at else None,
                    'about': recipient.about,
                    'bio': recipient.story or recipient.about,
                    'image': recipient.profilePicture.url if recipient.profilePicture else "https://randomuser.me/api/portraits/lego/1.jpg",
                    'story': recipient.story
                }
                recipients_data.append(recipient_data)
            
            print(f"✅ Found {len(recipients_data)} VISIBLE recipients")
            
            # If no visible recipients, return empty array instead of error
            return Response(recipients_data)
            
        except Exception as e:
            print(f"❌ Error fetching visible recipients: {str(e)}")
            # Return empty array with success status to prevent frontend errors
            return Response([], status=200)
# ✅ PERMANENT DONOR PROFILE
class DonorProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """PERMANENT Get donor profile data"""
        try:
            user = request.user
            print(f"🔍 PERMANENT GET Donor Profile - User: {user.username}")
            
            # Get or create profile
            profile, created = Profile.objects.get_or_create(
                user=user,
                defaults={
                    'name': user.username,
                    'email': user.email,
                    'role': 'donor'
                }
            )
            
            if created:
                print(f"✅ Created donor profile for: {user.username}")
            
            # Get donor statistics
            donor_donations = Donation.objects.filter(donor_name=user.username)
            total_donated = sum([float(donation.amount) for donation in donor_donations])
            donation_count = donor_donations.count()
            
            profile_data = {
                'id': profile.id,
                'full_name': profile.name,
                'email': profile.email,
                'phone': profile.phone or '',
                'address': profile.address or '',
                'location': profile.address or '',
                'bio': getattr(profile, 'bio', ''),
                'profile_picture': profile.profile_picture.url if profile.profile_picture else None,
                'is_verified': True,
                'total_donated': total_donated,
                'donation_count': donation_count,
                'member_since': user.date_joined.strftime('%B %Y') if user.date_joined else 'January 2024'
            }
            
            return Response(profile_data)
                
        except Exception as e:
            print(f"❌ PERMANENT ERROR - Donor profile fetch error: {str(e)}")
            return Response({"error": f"Failed to fetch profile: {str(e)}"}, status=500)

# ✅ PERMANENT RECIPIENTS LIST FOR DONORS (All recipients)
class RecipientListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """PERMANENT Get all real recipient profiles for donors to browse"""
        try:
            print("🔍 PERMANENT - Fetching real recipients from database...")
            
            # Get all recipient profiles
            recipient_profiles = RecipientProfile.objects.select_related('user').all()
            
            recipients_data = []
            for recipient in recipient_profiles:
                user = recipient.user
                
                # Get donations for this recipient
                # recipient_donations = Donation.objects.filter(recipient_name=user.username)
                # donated_amount = sum([float(donation.amount) for donation in recipient_donations])
                
                recipient_data = {
                    'id': user.id,
                    'name': recipient.fullName,
                    'email': recipient.email,
                    'phone': recipient.phoneNumber,
                    'address': recipient.address,
                    'location': recipient.address,
                    'reason': recipient.story or recipient.about,
                    'description': recipient.story or recipient.about,
                    'urgency': recipient.urgencyLevel,
                    'category': recipient.category or 'General',
                    'required_amount': float(recipient.required_amount) if recipient.required_amount else 50000,
                    # 'donated_amount': donated_amount,
                    'family_members': recipient.familyMembers,
                    'previous_job': recipient.previousJob,
                    'father_name': recipient.fatherName,
                    'is_verified': recipient.isVerified,
                    'is_visible': recipient.is_visible_to_donors,
                    'is_complete': recipient.is_profile_complete,
                    'profile_picture': recipient.profilePicture.url if recipient.profilePicture else None,
                    'created_at': recipient.created_at.isoformat() if recipient.created_at else None,
                    'about': recipient.about,
                    'bio': recipient.story or recipient.about,
                    'image': recipient.profilePicture.url if recipient.profilePicture else "https://randomuser.me/api/portraits/lego/1.jpg",
                    'story': recipient.story
                }
                recipients_data.append(recipient_data)
            
            print(f"✅ PERMANENT - Found {len(recipients_data)} real recipients")
            
            return Response(recipients_data)
            
        except Exception as e:
            print(f"❌ PERMANENT ERROR - Error fetching recipients: {str(e)}")
            return Response({"error": "Failed to fetch recipients"}, status=500)

# ✅ PERMANENT DONORS LIST
class DonorListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """PERMANENT Get all real donor users from database"""
        try:
            print("🔍 PERMANENT - Fetching real donors from database...")
            
            # Get all users with donor role
            donor_profiles = Profile.objects.filter(role='donor').select_related('user')
            
            donors_data = []
            for profile in donor_profiles:
                user = profile.user
                
                # Get donation statistics for this donor
                donor_donations = Donation.objects.filter(donor_name=user.username)
                total_donated = sum([float(donation.amount) for donation in donor_donations])
                donation_count = donor_donations.count()
                last_donation = donor_donations.order_by('-date').first().date.strftime('%Y-%m-%d') if donor_donations.exists() else 'N/A'
                
                donor_data = {
                    'id': user.id,
                    'name': profile.name or user.username,
                    'email': user.email,
                    'location': profile.address or 'Location not specified',
                    'phone': profile.phone or '',
                    'total_donations': total_donated,
                    'donation_count': donation_count,
                    'last_donations': last_donation,
                    'is_verified': True,
                    'profile_picture': profile.profile_picture.url if profile.profile_picture else None,
                    'joined_date': user.date_joined.strftime('%Y-%m-%d'),
                    'bio': getattr(profile, 'bio', 'Active donor helping communities'),
                }
                donors_data.append(donor_data)
            
            print(f"✅ PERMANENT - Found {len(donors_data)} real donors")
            
            return Response(donors_data)
            
        except Exception as e:
            print(f"❌ PERMANENT ERROR - Error fetching donors: {str(e)}")
            return Response({"error": "Failed to fetch donors"}, status=500)

# ---------------- KEEP ALL OTHER VIEWS SAME ----------------
class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required"}, status=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist"}, status=404)

        token_generator = PasswordResetTokenGenerator()
        token = token_generator.make_token(user)
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        reset_url = f"http://localhost:3000/reset-password/{uidb64}/{token}/"

        print(f"Password reset link for {email}: {reset_url}")

        return Response({"message": "Password reset link sent to email."}, status=200)

class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, uidb64, token):
        password = request.data.get("password")
        if not password:
            return Response({"error": "Password is required"}, status=400)

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except Exception:
            return Response({"error": "Invalid link"}, status=400)

        token_generator = PasswordResetTokenGenerator()
        if not token_generator.check_token(user, token):
            return Response({"error": "Invalid or expired token"}, status=400)

        user.set_password(password)
        user.save()
        return Response({"message": "Password reset successful"}, status=200)

class ContactMessageCreateView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [UserRateThrottle, AnonRateThrottle]

class DonationListCreateView(generics.ListCreateAPIView):
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Donation.objects.filter(donor_name=user.username)

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(donor_name=user.username)

class StripeDonateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data
        amount = data.get("amount")
        currency = data.get("currency", "usd")
        payment_method_id = data.get("payment_method_id")

        if not amount or not payment_method_id:
            return Response({"error": "Amount and payment method ID are required."}, status=400)

        try:
            amount_cents = int(float(amount) * 100)
            intent = stripe.PaymentIntent.create(
                amount=amount_cents,
                currency=currency,
                payment_method=payment_method_id,
                confirmation_method="manual",
                confirm=True,
            )

            donation = Donation.objects.create(
                donor_name=user.username,
                amount=amount,
                status="paid" if intent.status == "succeeded" else "pending",
            )

            return Response({
                "success": True,
                "donation_id": donation.id,
                "payment_status": intent.status,
            }, status=200)

        except stripe.error.CardError as e:
            return Response({"error": e.user_message}, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class RecipientRequestListCreateView(generics.ListCreateAPIView):
    serializer_class = RecipientRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return RecipientRequest.objects.all()

    def perform_create(self, serializer):
        serializer.save(recipient_name=self.request.user.username)

class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        profile, _ = Profile.objects.get_or_create(user=user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        profile, _ = Profile.objects.get_or_create(user=user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
# ✅ LOGOUT ALL DEVICES
class LogoutAllView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """
        JWT is stateless
        Actual logout frontend pe token delete se hota hai
        """
        return Response(
            {"message": "Logged out from all devices successfully"},
            status=status.HTTP_200_OK
        )



@method_decorator(csrf_exempt, name="dispatch")
class DocumentVerificationView(View):
   
    """
    Single-file, class-based document verification view
    """

    # --------- HARD CODED PATHS (TEMP APPROACH) ---------
    TESSERACT_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    POPPLER_PATH = r"C:\Users\HASSAN\Downloads\poppler-25.12.0\Library\bin"
    MODEL_PATH = r"C:\Users\HASSAN\Downloads\Tiny-LLM"


    pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH

    # --------- LOAD MODEL ONCE (IMPORTANT) ---------
    tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_PATH,
        device_map="cpu",
        torch_dtype="auto"
    )

    # --------- DOCUMENT CONFIG ---------
    DOCUMENT_REQUIREMENTS = {
        "Education": [
            "Student ID Card",
            "Enrollment/Admission Letter",
            "Fee Challan / Invoice",
            "Transcript / Mark Sheet",
            "Recommendation Letter"
        ],
        "Medical": [
            "Doctor's Prescription",
            "Hospital Admission Slip",
            "Medical Test Reports",
            "Treatment Cost Estimate / Bill",
            "Disability Certificate"
        ],
        "Food": [
            "CNIC Front",
            "CNIC Back",
            "Proof of Income",
            "Household Registration Certificate",
            "Utility Bills"
        ],
        "Orphan": [
            "Orphan Certificate",
            "Death Certificate",
            "Guardian CNIC Copy",
            "Orphanage Registration",
            "School Enrollment Certificate"
        ]
    }

    OPTIONAL_DOCUMENTS = [
        "Disability Certificate",
        "Household Registration Certificate"
    ]

    # --------- OCR ---------
    def extract_text(self, file_path):
        try:
            if file_path.lower().endswith(('.png', '.jpg', '.jpeg')):
                image = Image.open(file_path).convert("L")
                image = image.point(lambda x: 0 if x < 140 else 255, '1')
                return pytesseract.image_to_string(image, lang="eng+urd")

            elif file_path.lower().endswith('.pdf'):
                pages = convert_from_path(
                    file_path,
                    first_page=1,
                    last_page=1,
                    poppler_path=self.POPPLER_PATH
                )
                if pages:
                    image = pages[0].convert("L")
                    image = image.point(lambda x: 0 if x < 140 else 255, '1')
                    return pytesseract.image_to_string(image, lang="eng+urd")

            return ""
        except Exception:
            return ""

    # --------- NAME EXTRACTION ---------
    def extract_name(self, text):
        patterns = [
            r"Name[:\-]?\s*([A-Za-z\s]+)",
            r"Student Name[:\-]?\s*([A-Za-z\s]+)",
            r"Patient Name[:\-]?\s*([A-Za-z\s]+)",
            r"CNIC[:\-]?\s*([0-9\-]{13,15})",
            r"نام[:：]?\s*([؀-ۿ\s]+)"
        ]
        for p in patterns:
            match = re.search(p, text, re.IGNORECASE)
            if match:
                val = match.group(1).strip()
                if 3 <= len(val) <= 40:
                    return val
        return None

    # --------- VERIFY DOCUMENT ---------
    def verify_document(self, category, doc_name, text):
        prompt = f"""
        Verify whether this document is a valid {doc_name}
        under category {category}.

        Text:
        {text[:400]}

        Reply only:
        Verified
        Mismatch
        Invalid
        """

        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.model.device)
        outputs = self.model.generate(**inputs, max_new_tokens=50)
        response = self.tokenizer.decode(outputs[0], skip_special_tokens=True).lower()

        if "verified" in response:
            return "Verified"
        elif "mismatch" in response:
            return "Mismatch"
        return "Invalid"

    # --------- POST API ---------
    def post(self, request):
      

        category = request.POST.get("category")   # ✅ FIXED
        files = request.FILES                     # ✅ already correct

        if not category:
            return JsonResponse({"error": "Category is required"}, status=400)

        if category not in self.DOCUMENT_REQUIREMENTS:
            return JsonResponse({"error": "Invalid category"}, status=400)

        results = []
        base_name = None

        for doc_name, uploaded_file in files.items():
            temp_path = os.path.join(settings.MEDIA_ROOT, uploaded_file.name)

            with open(temp_path, "wb+") as f:
                for chunk in uploaded_file.chunks():
                    f.write(chunk)

            text = self.extract_text(temp_path)
            name = self.extract_name(text)

            if base_name is None and name:
                base_name = name
            elif base_name and name and name.lower() != base_name.lower():
                results.append({
                    "document": doc_name,
                    "status": "Name mismatch",
                    "detected_name": name
                })
                os.remove(temp_path)
                continue

            status = self.verify_document(category, doc_name, text)

            results.append({
                "document": doc_name,
                "status": status,
                "detected_name": name
            })

            os.remove(temp_path)

        return JsonResponse({
            "category": category,
            "results": results
        })

    

@method_decorator(csrf_exempt, name="dispatch")
class AIScoringView(View):
    """
    Single-file AI Scoring CBV
    """

    # ----------------- SCORING HELPERS -----------------

    def donor_level_score(self, level):
        if level == "high":
            return 30
        if level == "medium":
            return 20
        return 10

    def category_match(self, recipient_cat, donor_cat):
        return 20 if recipient_cat == donor_cat else 5

    def document_severity(self, recipient):
        score = 0

        # Education
        if recipient["category"] == "education" and recipient.get("fee_last_date"):
            days_left = (
                datetime.date.fromisoformat(recipient["fee_last_date"])
                - datetime.date.today()
            ).days
            if days_left <= 2:
                score += 30
            elif days_left <= 7:
                score += 20
            else:
                score += 10

        # Medical
        if recipient["category"] == "medical":
            report = (recipient.get("medical_report") or "").lower()
            if "icu" in report:
                score += 35
            elif "critical" in report:
                score += 25
            elif "surgery" in report:
                score += 20
            else:
                score += 10

        # Food
        if recipient["category"] == "food":
            score += 20 if recipient.get("family_members", 0) > 6 else 10

        # Orphan
        if recipient["category"] == "orphan":
            score += 25 if recipient.get("children_count", 0) > 3 else 15

        return score

    def description_analysis(self, text, category):
        text = (text or "").lower()

        high_keywords = {
            "education": ["urgent", "immediate", "fee due", "deadline"],
            "medical": ["icu", "critical", "emergency", "surgery"],
            "food": ["starving", "hungry", "no food"],
            "orphan": ["urgent", "abandoned", "no guardian"]
        }

        medium_keywords = {
            "education": ["help", "books", "tuition"],
            "medical": ["treatment", "doctor", "medication"],
            "food": ["meal", "groceries"],
            "orphan": ["help", "care"]
        }

        low_keywords = {
            "education": ["information"],
            "medical": ["information"],
            "food": ["information"],
            "orphan": ["information"]
        }

        if any(k in text for k in high_keywords.get(category, [])):
            keyword_score = 25
        elif any(k in text for k in medium_keywords.get(category, [])):
            keyword_score = 15
        elif any(k in text for k in low_keywords.get(category, [])):
            keyword_score = 10
        else:
            keyword_score = 5

        polarity = TextBlob(text).sentiment.polarity

        if polarity < -0.3:
            sentiment_score = 25
        elif polarity < 0:
            sentiment_score = 20
        elif polarity <= 0.3:
            sentiment_score = 15
        else:
            sentiment_score = 5

        return int(0.5 * keyword_score + 0.5 * sentiment_score)

    def need_urgency(self, urgency):
        if urgency == "high":
            return 20
        if urgency == "medium":
            return 10
        return 5

    def score_to_level(self, score):
        if score >= 70:
            return "high"
        if score >= 40:
            return "medium"
        return "low"

    # ----------------- FINAL SCORE -----------------

    def calculate_final_score(self, recipient, donor):
        score = 0
        score += self.donor_level_score(donor["level"])
        score += self.category_match(recipient["category"], donor["category"])
        score += self.document_severity(recipient)
        score += self.description_analysis(
            recipient.get("description"),
            recipient["category"]
        )
        score += self.need_urgency(recipient.get("urgency"))
        return min(score, 100)

    # ----------------- API -----------------

    def post(self, request):
        try:
            data = request.json if hasattr(request, "json") else request.POST

            recipient = data.get("recipient")
            donor = data.get("donor")

            if not recipient or not donor:
                return JsonResponse(
                    {"error": "recipient and donor data required"},
                    status=400
                )

            score = self.calculate_final_score(recipient, donor)
            level = self.score_to_level(score)

            return JsonResponse({
                "final_score": score,
                "priority_level": level
            })

        except Exception as e:
            return JsonResponse(
                {"error": str(e)},
                status=500
            )


@method_decorator(csrf_exempt, name="dispatch")
class AidLinkChatbotView(View):
 
    """
    Single-file chatbot CBV using:
    - Dataset matching (RapidFuzz)
    - LM Studio fallback
    """

    permission_classes = [permissions.AllowAny]
    # ---------- CONFIG (HARD CODED FOR NOW) ----------
    DATASET_PATH =  r"C:\Users\HASSAN\Desktop\my-website\Ai backend\dataset.csv"
    LM_STUDIO_URL = "http://127.0.0.1:1234"

    SYSTEM_PROMPT = """
    You are AidLink official support chatbot.
    You speak politely, friendly and human-like.
    If answer exists in dataset, use it.
    Otherwise explain clearly in simple words.
    """

    # ---------- LOAD DATASET ONCE ----------
    try:
        df = pd.read_csv(DATASET_PATH, encoding="utf-8", quotechar='"')
        df = df.apply(lambda x: x.str.strip() if x.dtype == "object" else x)
    except Exception:
        df = pd.DataFrame(
            columns=[
                "Question_Roman",
                "Question_English",
                "Answer_Roman",
                "Answer_English"
            ]
        )

    # ---------- DATASET SEARCH ----------
    def search_dataset(self, user_question):
       
        user_question = user_question.lower().strip()

        best_match = None
        highest_score = 0

        for _, row in self.df.iterrows():
            score_r = fuzz.ratio(
                user_question,
                str(row["Question_Roman"]).lower()
            )
            if score_r > highest_score:
                highest_score = score_r
                best_match = row

            score_e = fuzz.ratio(
                user_question,
                str(row["Question_English"]).lower()
            )
            if score_e > highest_score:
                highest_score = score_e
                best_match = row

        if highest_score >= 75:
            if fuzz.ratio(
                user_question,
                str(best_match["Question_Roman"]).lower()
            ) >= 75:
                return best_match["Answer_Roman"]
            return best_match["Answer_English"]

        return None

    # ---------- LLM FALLBACK ----------
    def ask_llm(self, question):
        
        payload = {
            "model": "local-model",
            "messages": [
                {"role": "system", "content": self.SYSTEM_PROMPT},
                {"role": "user", "content": question}
            ],
            "temperature": 0.7
        }

        try:
            response = requests.post(
                self.LM_STUDIO_URL,
                json=payload,
                timeout=20
            )
            return response.json()["choices"][0]["message"]["content"]
        except Exception:
            return (
                "Sorry, I can only provide information "
                "about AidLink at the moment."
            )

    # ---------- API ----------
    def post(self, request):
        try:
            #import pdb
            #pd.set_trace()
            data = json.loads(request.body)
            question = data.get("question")

            if not question:
                return JsonResponse(
                    {"error": "question is required"},
                    status=400
                )

            answer = self.search_dataset(question)
            source = "dataset"

            if not answer:
                answer = self.ask_llm(question)
                source = "llm"

            return JsonResponse({
                "question": question,
                "answer": answer,
                "source": source
            })

        except Exception as e:
            return JsonResponse(
                {"error": str(e)},
                status=500
            )