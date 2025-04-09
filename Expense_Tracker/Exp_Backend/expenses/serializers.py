from rest_framework import serializers
from expenses.models import User, Expense, Income, Budget
from django.utils.timezone import make_aware
from datetime import datetime, time

class UserRegistrationSerialier(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type':'password'}, write_only=True)
    class Meta:
        model= User
        fields= '__all__'
        extra_kwargs={
            'password':{'write_only': True}
        }

    def validate(self, attrs):
        password=attrs.get('password')
        password2=attrs.get('password2')
        if password != password2:
            raise serializers.ValidationError('Password & Conf Password Doesnt match')
        return attrs
    
    def create(self, validate_data):
        return User.objects.create_user(**validate_data)
    
class UserLoginSerializer(serializers.ModelSerializer):
    email=serializers.EmailField(max_length=255)
    class Meta:
        model = User
        fields= ['email','password']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email','name']

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model=Expense
        fields = ['id', 'title', 'amount', 'category', 'description', 'user']
        read_only_fields = ['user']

class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model= Income
        fields = ['id', 'title', 'amount', 'source', 'description', 'user']
        read_only_fields = ['user']

class BudgetSerializer(serializers.ModelSerializer):
    alert = serializers.SerializerMethodField()
    class Meta:
        model= Budget
        fields = ['id', 'amount_limit', 'start_date', 'end_date', 'user']
        read_only_fields = ['user']
    def get_alert(self, obj):
        start = make_aware(datetime.combine(obj.start_date, time.min))
        end = make_aware(datetime.combine(obj.end_date, time.max))
        expenses = Expense.objects.filter(user=obj.user, created_at__range=(start, end))
        total_spent = sum(exp.amount for exp in expenses)
        return total_spent > obj.amount_limit