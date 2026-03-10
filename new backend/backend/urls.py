from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from api import views
from api.views import CustomTokenObtainPairView

urlpatterns = [
    path('api/',include('api.urls')),
    path('admin/', admin.site.urls),

#     # JWT login/logout routes
#     path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
#     path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

#     # Custom endpoints
#     path('api/register/', views.RegisterView.as_view(), name='register'),
#     path('api/forgot-password/', views.ForgotPasswordView.as_view(), name='forgot-password'),
#     path('api/reset-password/<uidb64>/<token>/', views.ResetPasswordView.as_view(), name='reset-password'),
#     path('api/contact/', views.ContactMessageCreateView.as_view(), name='contact'),
#     path('api/donations/', views.DonationListCreateView.as_view(), name='donations'),
#     path('api/stripe-donate/', views.StripeDonateView.as_view(), name='stripe-donate'),
#     path('api/requests/', views.RecipientRequestListCreateView.as_view(), name='recipient-requests'),
#     path('api/profile/', views.ProfileView.as_view(), name='profile'),
#         path('api/donors/', views.donors, name='donors'),
# 
]
