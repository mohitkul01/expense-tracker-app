from rest_framework import serializers
from .models import User, Category, Expense


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'last_login', 'is_active')
        read_only_fields = ('id',)


class CategorySerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ('id', 'user')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class ExpenseSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    user = UserSerializer(read_only=True)

    categoryId = serializers.PrimaryKeyRelatedField(
        source='category',
        queryset=Category.objects.all(),
        write_only=True
    )

    class Meta:
        model = Expense
        fields = ['id', 'title', 'amount', 'date', 'category', 'user', 'categoryId']
        read_only_fields = ['id', 'user', 'category', 'user']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
