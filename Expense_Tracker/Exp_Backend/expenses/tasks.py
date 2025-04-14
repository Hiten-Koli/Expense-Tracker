from celery import shared_task
from .models import Budget, Expense
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.utils.timezone import make_aware
from datetime import datetime, time
from django.conf import settings
from django.utils.html import strip_tags
from django.core.cache import cache
import environ

env = environ.Env()
environ.Env.read_env()

@shared_task
def send_budget_email_notification(budget_id):
    
    budget = Budget.objects.get(id=budget_id)
    user = budget.user
    subject = "Budget Limit Exceeded"
    from_email = settings.EMAIL_HOST_USER
    to_email = [user.email]
    start = make_aware(datetime.combine(budget.start_date, time.min))
    end = make_aware(datetime.combine(budget.end_date, time.max))
    expenses = Expense.objects.filter(user=user, created_at__range=(start, end))
    total_spent = sum(exp.amount for exp in expenses)
    context = {
        "user_name": user.name,
        "amount_limit": budget.amount_limit,
        "total_spent": total_spent,
        "start_date": budget.start_date,
        "end_date": budget.end_date,
    }
    html_content = render_to_string("email.html", context)
    text_content = strip_tags(html_content)
    msg = EmailMultiAlternatives(subject, text_content, from_email, to_email)
    msg.attach_alternative(html_content, "text/html")
    msg.send()

    budget.notified = True
    budget.save()

    return "Email sent"

#Email verification OTP
@shared_task
def send_otp(email, otp):
    subject = "Verification OTP"
    from_email = settings.EMAIL_HOST_USER
    to_email = [email]
    context = {
        "otp": otp,
    }
    html_content = render_to_string("otp.html", context)
    text_content = strip_tags(html_content)
    msg = EmailMultiAlternatives(subject, text_content, from_email, to_email)
    msg.attach_alternative(html_content, "text/html")
    msg.send()
    print("OTP sent!!")
    return "OTP Sent"
