# from rest_framework.permissions import BasePermission

# class IsAdmin(BasePermission):
#     """Allows access only to Admin users"""
#     def has_permission(self, request, view):
#         return request.user.is_authenticated and request.user.role == 'admin'

# class IsManager(BasePermission):
#     """Allows access to Admins and Managers"""
#     def has_permission(self, request, view):
#         return request.user.is_authenticated and request.user.role in ['admin', 'manager']

# class IsOwnerOrReadOnly(BasePermission):
#     """Users can only modify their own expenses"""
#     def has_object_permission(self, request, view, obj):
#         return request.user == obj.user or request.user.role in ['admin', 'manager']