import django_filters.rest_framework as filters
from .models import Expense, Income
from django.utils.timezone import make_aware
from datetime import datetime, time

class ExpenseFilter(filters.FilterSet):
    title = filters.CharFilter(field_name= 'title', lookup_expr='icontains')
    description= filters.CharFilter(field_name= 'description', lookup_expr='icontains')
    amount = filters.NumberFilter(field_name='amount', lookup_expr='iexact')
    start_date = filters.DateFilter(field_name='created_at', lookup_expr='gte', label='From date')
    end_date = filters.DateFilter(method='filter_end_date', label='To date')
    def filter_end_date(self, queryset, name, value):
        #Sets end_date to the end of the day (23:59:59.999999)
        end_of_day = datetime.combine(value, time.max)
        end_of_day = make_aware(end_of_day)  # make it timezone-aware
        return queryset.filter(created_at__lte=end_of_day)
    class Meta:
        model = Expense
        fields = ['title','description', 'amount'] 

class IncomeFilter(filters.FilterSet):
    title = filters.CharFilter(field_name= 'title', lookup_expr='icontains')
    description= filters.CharFilter(field_name= 'description', lookup_expr='icontains')
    amount = filters.NumberFilter(field_name='amount', lookup_expr='iexact')
    start_date = filters.DateFilter(field_name='created_at', lookup_expr='gte', label='From date')
    end_date = filters.DateFilter(method='filter_end_date', label='To date')
    def filter_end_date(self, queryset, name, value):
        #Sets end_date to the end of the day (23:59:59.999999)
        end_of_day = datetime.combine(value, time.max)
        end_of_day = make_aware(end_of_day)  # make it timezone-aware
        return queryset.filter(created_at__lte=end_of_day)
    class Meta:
        model = Income
        fields = ['title','description', 'amount']

