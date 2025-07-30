# api/management/commands/send_reminders.py

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.core.mail import send_mail
from datetime import datetime, timedelta
from api.models import MoodEntry

class Command(BaseCommand):
    help = 'Send daily mood tracker check-in email reminders to users who have not logged today.'

    def handle(self, *args, **kwargs):
        today = datetime.now().date()
        yesterday = today - timedelta(days=1)
        
        # Find users who have NOT submitted a mood entry today
        users = User.objects.all()
        for user in users:
            # Check if user has any MoodEntry for today
            mood_logged_today = MoodEntry.objects.filter(user=user, timestamp__date=today).exists()

            if not mood_logged_today:
                # Send reminder email
                send_mail(
                    subject='Daily Mood Tracker Reminder',
                    message=f'Hi {user.username}, please remember to log your mood today in the app.',
                    from_email='your_email@example.com',  # Replace with your "from" email
                    recipient_list=[user.email],
                    fail_silently=False,
                )
                self.stdout.write(f'Reminder sent to {user.username} ({user.email})')
