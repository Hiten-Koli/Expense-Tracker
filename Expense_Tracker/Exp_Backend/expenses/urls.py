from django.urls import path, include
from expenses.views import UserRegistrationView, UserLoginView,  ExpenseView, IncomeView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'expenses', ExpenseView)
router.register(r'incomes', IncomeView)

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    # path('profile/', UserProfileView.as_view(), name='profile'),
    path('', include(router.urls)),
]