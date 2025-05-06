from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *
from graphene_django.views import GraphQLView
from .schema import schema

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'categories', CategoryViewSet, basename= 'category')
router.register(r'expenses', ExpenseViewSet, basename= 'expense')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('gql/', GraphQLView.as_view(graphiql=True, schema=schema)),
]
