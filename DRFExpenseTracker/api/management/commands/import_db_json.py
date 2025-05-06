import json
from django.core.management.base import BaseCommand
from api.models import Category, Expense
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Import data from db.json into Django models'

    def handle(self, *args, **kwargs):
        # Path to your db.json file
        file_path = 'path/to/your/db.json'

        try:
            # Open and load the JSON data from the file
            with open(file_path, 'r') as file:
                data = json.load(file)

            # Clear existing data in the models if needed
            Category.objects.all().delete()
            Expense.objects.all().delete()
            User.objects.all().delete()

            # Import users
            for user_data in data['users']:
                User.objects.create(
                    id=user_data['id'],
                    username=user_data['username'],
                    password=user_data['password'],  # You might want to hash the password before saving
                )

            # Import categories
            for category_data in data['categories']:
                Category.objects.create(
                    id=category_data['id'],
                    name=category_data['name'],
                )

            # Import expenses
            for expense_data in data['expenses']:
                # Get the user and category objects based on the ids
                user = User.objects.get(id=expense_data['userId'])
                category = Category.objects.get(id=expense_data['categoryId'])

                Expense.objects.create(
                    id=expense_data['id'],
                    title=expense_data['title'],
                    amount=expense_data['amount'],
                    date=expense_data['date'],
                    user=user,
                    category=category,
                )

            self.stdout.write(self.style.SUCCESS('Successfully imported data from db.json'))
        
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error importing data: {str(e)}'))
