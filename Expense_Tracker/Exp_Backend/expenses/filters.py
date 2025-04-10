import django_filters
from .models import Expense, Income

class ExpenseFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(field_name= 'title', lookup_expr='icontains')
    description= django_filters.CharFilter(field_name= 'description', lookup_expr='icontains')
    amount = django_filters.NumberFilter(field_name='amount', lookup_expr='iexact')
    class Meta:
        model = Expense
        fields = ['title','description', 'amount']

class IncomeFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(field_name= 'title', lookup_expr='icontains')
    description= django_filters.CharFilter(field_name= 'description', lookup_expr='icontains')
    amount = django_filters.NumberFilter(field_name='amount', lookup_expr='iexact')
    class Meta:
        model = Income
        fields = ['title','description', 'amount']