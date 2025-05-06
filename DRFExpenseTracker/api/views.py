from rest_framework import viewsets, status
from .models import User, Category, Expense
from .serializers import UserSerializer, CategorySerializer, ExpenseSerializer
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from rest_framework_simplejwt.tokens import RefreshToken
import uuid

# Create your views here.

@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'detail': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, username=username, password=password)

    if user:
        # Create JWT token
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        # Return the tokens in the response
        return Response({
            'username': username,
            'access': access_token,
            'refresh': refresh_token
        }, status=status.HTTP_200_OK)
    else:
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({'detail': 'Logged out successfully'}, status=status.HTTP_200_OK)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]


class CategoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.filter(user = self.request.user)
    
    def perform_create(self, serializer):
        return serializer.save(user = self.request.user)


class ExpenseViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        return Expense.objects.filter(user = self.request.user)
    
    def perform_create(self, serializer):
        return serializer.save(user = self.request.user)
