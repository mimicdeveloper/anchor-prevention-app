from django.db import models
from django.contrib.auth.models import User


class MoodEntry(models.Model):
    MOOD_CHOICES = [
        ('happy', 'Happy'),
        ('sad', 'Sad'),
        ('anxious', 'Anxious'),
        ('angry', 'Angry'),
        ('neutral', 'Neutral'),
        ('other', 'Other'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    mood = models.CharField(max_length=20, choices=MOOD_CHOICES)
    note = models.TextField(blank=True)
    sentiment = models.FloatField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.mood} on {self.timestamp.date()}"


class CrisisResource(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    phone = models.CharField(max_length=50, blank=True, null=True)
    website = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name


class SupportPost(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # user is now required (non-nullable)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    votes = models.PositiveIntegerField(default=0)
    upvoted_by = models.ManyToManyField(User, related_name='upvoted_posts', blank=True)  # 🔥 added

    def __str__(self):
        return f"{self.user.username} - {self.created_at.date()}"


class Reply(models.Model):
    post = models.ForeignKey(SupportPost, on_delete=models.CASCADE, related_name='replies')
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # user is now required (non-nullable)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    votes = models.PositiveIntegerField(default=0)
    upvoted_by = models.ManyToManyField(User, related_name='upvoted_replies', blank=True)  # Added for upvotes

    def __str__(self):
        return f"Reply by {self.user.username} on {self.created_at.date()}"
