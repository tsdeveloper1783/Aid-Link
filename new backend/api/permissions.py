from rest_framework import permissions

class IsDonor(permissions.BasePermission):
    """
    Allows access only to users with role 'donor'
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, "profile") and request.user.profile.role == "donor"

class IsRecipient(permissions.BasePermission):
    """
    Allows access only to users with role 'recipient'
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, "profile") and request.user.profile.role == "recipient"

class IsAdminUser(permissions.BasePermission):
    """
    Allows access only to staff/admin users
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_staff
