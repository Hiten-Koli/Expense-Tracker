from celery import shared_task
from .models import Budget, Expense
from django.core.mail import send_mail

@shared_task
def check_budget_limit():

    for budget in Budget.objects.all():
        user = budget.user
        expenses = Expense.objects.filter(user=user)
        total_amt = sum(exp.amount for exp in expenses)
        if (total_amt>budget.amount_limit):
            send_mail()
    
    return "Budget check completed !!"
