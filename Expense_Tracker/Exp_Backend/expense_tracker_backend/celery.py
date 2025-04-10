from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab
# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'expense_tracker_backend.settings')

app = Celery('expense_tracker_backend')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

app.conf.beat_schedule = {
    'send-email-everyday':{
        'task': 'expenses.tasks.check_budget_limit',
        'schedule': crontab(hour = 17, minute= 5 )
    }
}

# Load task modules from all registered Django apps.
app.autodiscover_tasks()