from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, MoodEntryViewSet, CrisisResourceViewSet, SupportPostViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'mood-entries', MoodEntryViewSet, basename='moodentry')
router.register(r'crisis-resources', CrisisResourceViewSet, basename='crisisresource')
router.register(r'support-posts', SupportPostViewSet, basename='supportpost')

urlpatterns = [
    path('', include(router.urls)),

    # User registration endpoint
    path('register/', UserViewSet.as_view({'post': 'create'}), name='register'),

    # JWT authentication endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # to get access and refresh tokens
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # to refresh access token
]
