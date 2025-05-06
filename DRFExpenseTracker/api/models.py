import uuid
from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="categories")

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Expense(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="expenses")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="expenses")

    class Meta:
        verbose_name_plural = "Expenses"

    def __str__(self):
        return f"{self.title} - {self.amount}"
