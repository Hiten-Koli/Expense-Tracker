from django.urls import path, include
from expenses.views import UserRegistrationView, UserLoginView,  ExpenseView, IncomeView, BudgetView
from rest_framework.routers import DefaultRouter
from .views import get_budget_alert

router = DefaultRouter()
router.register(r'expenses', ExpenseView)
router.register(r'incomes', IncomeView)
router.register(r'budgets', BudgetView)

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('budget-alert/', get_budget_alert, name='budget-alert'),
    # path('profile/', UserProfileView.as_view(), name='profile'),
    path('', include(router.urls)),

]