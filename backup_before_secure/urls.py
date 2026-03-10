from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # basic route check
    path('', views.getRoutes, name='api-routes'),

    # function-based views (agar tumne inko rakha hai)
    path('notes/', views.getNotes, name='get-notes'),
    path('notes/<int:pk>/', views.getNote, name='get-note'),
    path('notes/create/', views.createNote, name='create-note'),
    path('notes/update/<int:pk>/', views.updateNote, name='update-note'),
    path('notes/delete/<int:pk>/', views.deleteNote, name='delete-note'),

    # class-based views (new clean APIs)
    path('notes/cbv/', views.NoteListCreate.as_view(), name='note-list-create'),
    path('notes/cbv/<int:pk>/', views.NoteDetail.as_view(), name='note-detail'),

    # authentication
    path('register/', views.register_user, name='register-user'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
