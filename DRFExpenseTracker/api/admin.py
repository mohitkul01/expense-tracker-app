from django.contrib import admin
from .models import User, Category, Expense

# Register your models here.
# @admin.register(User)
# class UserAdmin(admin.ModelAdmin):
#     list_display = ('id', 'username', 'password') 
#     search_fields = ('username',)
#     list_filter = ('username',)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'id')
    search_fields = ('user',)

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'amount', 'date', 'category', 'user')
    search_fields = ('title', 'category__name', 'user__username')
    list_filter = ('category', 'user', 'date')
