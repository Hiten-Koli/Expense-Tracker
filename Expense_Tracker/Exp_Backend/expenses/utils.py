from django.utils.timezone import make_aware
from datetime import datetime, time
from .models import Budget, Expense
from .tasks import send_budget_email_notification

def check_and_notify_budget(user):
    today = datetime.now().date()
    budgets = Budget.objects.filter(
        user=user,
        start_date__lte=today,
        end_date__gte=today,
        notified=False
    )
    for budget in budgets:
        start = make_aware(datetime.combine(budget.start_date, time.min))
        end = make_aware(datetime.combine(budget.end_date, time.max))
        expenses = Expense.objects.filter(user=user, created_at__range=(start, end))
        total_spent = sum(e.amount for e in expenses)

        if total_spent > budget.amount_limit:
            # Trigger Celery email task
            send_budget_email_notification.delay(budget.id)
