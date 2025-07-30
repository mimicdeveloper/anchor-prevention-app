from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from .models import MoodEntry, CrisisResource, SupportPost, Reply


# Serializer for User info nested in posts and replies
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


# Registration serializer for user creation
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


# Mood entry serializer
class MoodEntrySerializer(serializers.ModelSerializer):
    sentiment = serializers.FloatField(read_only=True)
    timestamp = serializers.DateTimeField(read_only=True)

    class Meta:
        model = MoodEntry
        fields = ['id', 'note', 'mood', 'timestamp', 'sentiment']  # Add 'mood' here
        read_only_fields = ['id', 'timestamp', 'sentiment']



# Crisis resource serializer
class CrisisResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrisisResource
        fields = '__all__'


# Reply serializer, includes nested user info or null
class ReplySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True, allow_null=True)

    class Meta:
        model = Reply
        fields = ['id', 'post', 'user', 'content', 'created_at']


# SupportPost serializer, includes nested user info or null and nested replies,
# plus user_has_upvoted field to indicate if current user has upvoted this post
class SupportPostSerializer(serializers.ModelSerializer):
    replies = ReplySerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True, allow_null=True)
    user_has_upvoted = serializers.SerializerMethodField()

    class Meta:
        model = SupportPost
        fields = ['id', 'user', 'content', 'created_at', 'votes', 'replies', 'user_has_upvoted']

    def get_user_has_upvoted(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.upvoted_by.filter(id=request.user.id).exists()
        return False
