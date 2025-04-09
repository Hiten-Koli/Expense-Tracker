from celery import shared_task
from .models import Budget, Expense
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.utils.timezone import make_aware
from datetime import datetime, time

import environ

env = environ.Env()
environ.Env.read_env()
@shared_task(name="expenses.tasks.check_budget_limit")
def check_budget_limit():

    for budget in Budget.objects.all():
        user = budget.user
        start_datetime = make_aware(datetime.combine(budget.start_date, time.min))
        end_datetime = make_aware(datetime.combine(budget.end_date, time.max))
        expenses = Expense.objects.filter(user=user, created_at__gte=start_datetime, created_at__lte=end_datetime) 
        total_amt = sum(exp.amount for exp in expenses)
        if (total_amt>budget.amount_limit):
            subject = "Budget Limit Exceeded !!"
            from_email = env('EMAIL_HOST_USER')
            to = user.email
            context = {
                "user_name": user.name,
                "amount_limit": budget.amount_limit,
                "total_spent": total_amt,
            }
            text_content = "This is an important message."
            html_content = render_to_string("./email.html", context)
            msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
            msg.attach_alternative(html_content, "text/html")
            msg.send()
    return "Budget check completed !!"
