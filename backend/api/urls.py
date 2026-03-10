from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from . import views
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions

from .views import DocumentVerificationView


from .views import AIScoringView


from .views import AidLinkChatbotView
# ✅ DEBUG: List all available endpoints
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def list_endpoints(request):
    url_patterns = [
        '/api/register/',
        '/api/token/',
        '/api/token/refresh/',
        '/api/forgot-password/',
        '/api/reset-password/<uidb64>/<token>/',
        '/api/recipient/profile/',
        '/api/donor/profile/',
        '/api/profile/',
        '/api/recipients/',
        '/api/recipients/visible/',  # ✅ THIS SHOULD BE HERE
        '/api/donors/',
        '/api/contact/',
        '/api/donations/',
        '/api/requests/',
        '/api/stripe-donate/',
        '/api/messages/',
        '/api/notifications/',
        '/api/preferences/',
        '/api/debug/',
    ]
    return JsonResponse({"available_endpoints": url_patterns})

urlpatterns = [
    # ✅ DEBUG & HEALTH CHECK
    path('debug/', views.debug_api, name='debug_api'),
    path('endpoints/', list_endpoints, name='list_endpoints'),  # ✅ FIXED: Remove views. prefix
    
    # ✅ AUTH ENDPOINTS
    path('register/', views.RegisterView.as_view(), name='register'),
    path('token/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('forgot-password/', views.ForgotPasswordView.as_view(), name='forgot_password'),
    path('reset-password/<uidb64>/<token>/', views.ResetPasswordView.as_view(), name='reset_password'),
    path('logout-all/', views.LogoutAllView.as_view(), name='logout_all'),

    # ✅ PROFILE ENDPOINTS
    path('recipient/profile/', views.RecipientProfileView.as_view(), name='recipient_profile'),
    path('donor/profile/', views.DonorProfileView.as_view(), name='donor_profile'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    
    # ✅ RECIPIENTS ENDPOINTS - FIXED
    path('recipients/', views.RecipientListView.as_view(), name='recipients_list'),
    path('recipients/visible/', views.VisibleRecipientsView.as_view(), name='visible_recipients'),  # ✅ ADD THIS LINE
    
    # ✅ DONORS ENDPOINTS
    path('donors/', views.DonorListView.as_view(), name='donors_list'),
    
    # ✅ OTHER ENDPOINTS
    path('contact/', views.ContactMessageCreateView.as_view(), name='contact'),
    path('donations/', views.DonationListCreateView.as_view(), name='donations'),
    path('requests/', views.RecipientRequestListCreateView.as_view(), name='requests'),
    path('stripe-donate/', views.StripeDonateView.as_view(), name='stripe_donate'),
    path('messages/', views.messages, name='messages'),
    path('notifications/', views.notifications, name='notifications'),
    path('preferences/', views.preferences, name='preferences'),
     path(
        "verify-documents",
        DocumentVerificationView.as_view(),
        name="verify-documents"
    ),
      path(
        "ai-score",
        AIScoringView.as_view(),
        name="ai-score"
    ),
       path(
        "chatbot",
        AidLinkChatbotView.as_view(),
        name="aidlink-chatbot"
    ),
]