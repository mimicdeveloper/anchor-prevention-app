from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from .models import MoodEntry, CrisisResource, SupportPost, Reply
from .serializers import (
    RegisterSerializer,
    MoodEntrySerializer,
    CrisisResourceSerializer,
    SupportPostSerializer,
    ReplySerializer
)
from .utils.sentiment import analyze_sentiment


# Custom permission: user must be owner or admin
class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return obj == request.user


# User registration and management viewset
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [permissions.IsAdminUser]
        elif self.action == 'create':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# MoodEntry viewset
class MoodEntryViewSet(viewsets.ModelViewSet):
    serializer_class = MoodEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only mood entries of the logged-in user, newest first
        return MoodEntry.objects.filter(user=self.request.user).order_by('-timestamp')

    def perform_create(self, serializer):
        note = serializer.validated_data.get('note', '')
        sentiment_score = analyze_sentiment(note)
        serializer.save(user=self.request.user, sentiment=sentiment_score)


# CrisisResource viewset (public access)
class CrisisResourceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CrisisResource.objects.all()
    serializer_class = CrisisResourceSerializer
    permission_classes = [permissions.AllowAny]


# SupportPost viewset with toggle upvote, reply, and permission controls
class SupportPostViewSet(viewsets.ModelViewSet):
    queryset = SupportPost.objects.all().order_by('-created_at')
    serializer_class = SupportPostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def upvote(self, request, pk=None):
        post = self.get_object()
        user = request.user

        if post.upvoted_by.filter(id=user.id).exists():
            post.upvoted_by.remove(user)
            post.votes = post.upvoted_by.count()
            post.save()
            return Response({
                'message': 'Upvote removed.',
                'votes': post.votes,
                'user_has_upvoted': False
            }, status=status.HTTP_200_OK)
        else:
            post.upvoted_by.add(user)
            post.votes = post.upvoted_by.count()
            post.save()
            return Response({
                'message': 'Upvoted.',
                'votes': post.votes,
                'user_has_upvoted': True
            }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def reply(self, request, pk=None):
        content = request.data.get('content')
        if not content:
            return Response({'error': 'Reply content required'}, status=status.HTTP_400_BAD_REQUEST)

        post = self.get_object()
        reply = Reply.objects.create(
            post=post,
            user=request.user,
            content=content
        )
        return Response({
            'message': 'Reply added successfully.',
            'reply': ReplySerializer(reply).data
        }, status=status.HTTP_201_CREATED)

    # Toggle upvote on a reply - same toggle logic as post upvote
    @action(detail=True, methods=['post'], url_path='reply/(?P<reply_id>[^/.]+)/upvote')
    def toggle_reply_upvote(self, request, pk=None, reply_id=None):
        post = self.get_object()
        reply = get_object_or_404(post.replies, id=reply_id)
        user = request.user

        if reply.upvoted_by.filter(id=user.id).exists():
            reply.upvoted_by.remove(user)
            reply.votes = reply.upvoted_by.count()
            reply.save()
            return Response({
                'message': 'Upvote removed.',
                'votes': reply.votes,
                'user_has_upvoted': False
            }, status=status.HTTP_200_OK)
        else:
            reply.upvoted_by.add(user)
            reply.votes = reply.upvoted_by.count()
            reply.save()
            return Response({
                'message': 'Upvoted.',
                'votes': reply.votes,
                'user_has_upvoted': True
            }, status=status.HTTP_200_OK)

    # Delete a reply
    @action(detail=True, methods=['delete'], url_path='reply/(?P<reply_id>[^/.]+)')
    def delete_reply(self, request, pk=None, reply_id=None):
        post = self.get_object()
        reply = get_object_or_404(post.replies, id=reply_id)

        if reply.user != request.user and not request.user.is_staff:
            raise PermissionDenied("You do not have permission to delete this reply.")

        reply.delete()
        return Response({'message': 'Reply deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)

    def destroy(self, request, *args, **kwargs):
        post = self.get_object()
        if post.user != request.user and not request.user.is_staff:
            raise PermissionDenied("You do not have permission to delete this post.")
        return super().destroy(request, *args, **kwargs)
