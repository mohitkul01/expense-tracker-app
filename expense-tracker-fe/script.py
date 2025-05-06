from datetime import datetime, timedelta
import random
import json
import uuid

# Sample categories
categories = [
    {"id": 1, "name": "Food"},
    {"id": 2, "name": "Travel"},
    {"id": 3, "name": "Bills"},
    {"id": 4, "name": "Entertainment"},
    {"id": 5, "name": "Shopping"}
]

# Sample titles per category
titles = {
    1: ["Lunch", "Dinner", "Snacks", "Breakfast", "Coffee"],
    2: ["Uber", "Train Ticket", "Flight", "Fuel", "Bus Pass"],
    3: ["Electricity Bill", "Water Bill", "Internet", "Mobile Recharge", "Gas Bill"],
    4: ["Netflix", "Movie", "Concert", "Game", "Spotify"],
    5: ["T-shirt", "Shoes", "Bag", "Watch", "Headphones"]
}

# Generate 30 days of expenses
start_date = datetime(2025, 3, 10)
expenses = []

for i in range(30):
    date = start_date + timedelta(days=i)
    for _ in range(random.randint(1, 3)):  # 1 to 3 expenses per day
        cat = random.choice(categories)
        title = random.choice(titles[cat["id"]])
        expense = {
            "id": str(uuid.uuid4())[:4],
            "title": title,
            "amount": round(random.uniform(50, 500), 2),
            "date": date.replace(
                hour=random.randint(7, 23),
                minute=random.randint(0, 59)
            ).isoformat(timespec='minutes'),
            "categoryId": cat["id"]
        }
        expenses.append(expense)

db2_json = {
    "categories": categories,
    "expenses": expenses
}

# Output as formatted JSON
json.dumps(db2_json, indent=2)
