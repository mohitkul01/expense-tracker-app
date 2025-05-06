import graphene
import graphql_jwt
from graphene_django.types import DjangoObjectType
from .models import Expense, Category

# Object Types
class ExpenseType(DjangoObjectType):
    class Meta:
        model = Expense
        fields = "__all__"

class CategoryType(DjangoObjectType):
    class Meta:
        model = Category
        fields = "__all__"

# Queries
class Query(graphene.ObjectType):
    all_expenses = graphene.List(ExpenseType)
    all_categories = graphene.List(CategoryType)

    def resolve_all_expenses(self, info):
        user = info.context.user
        if user.is_authenticated:
            return Expense.objects.filter(user=user)
        else:
            raise Exception("Authentication required")

    def resolve_all_categories(self, info):
        user = info.context.user
        if user.is_authenticated:
            return Category.objects.filter(user=user)
        else:
            raise Exception("Authentication required")

# Mutations
class CreateExpense(graphene.Mutation):
    class Arguments:
        title = graphene.String(required=True)
        amount = graphene.Decimal(required=True)
        date = graphene.DateTime(required=True)
        category_id = graphene.UUID(required=True)

    expense = graphene.Field(ExpenseType)

    def mutate(self, info, title, amount, date, category_id):
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Authentication required")
        
        try:
            category = Category.objects.get(id=category_id, user=user)
        except Category.DoesNotExist:
            raise Exception("Invalid category")

        expense = Expense.objects.create(
            title=title,
            amount=amount,
            date=date,
            category=category,
            user=user
        )
        return CreateExpense(expense=expense)
    
class CreateCategory(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)

    category = graphene.Field(CategoryType)

    def mutate(self, info, name):
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Authentication required")

        category = Category.objects.create(name=name, user=user)
        return CreateCategory(category=category)

class Mutation(graphene.ObjectType):
    create_expense = CreateExpense.Field()
    create_category = CreateCategory.Field()

    # Add JWT mutations
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()

# Root Schema
schema = graphene.Schema(query=Query, mutation=Mutation)
