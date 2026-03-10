from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from api import views
from api.views import CustomTokenObtainPairView

urlpatterns = [
    path('api/',include('api.urls')),
    path('admin/', admin.site.urls),

 
]
