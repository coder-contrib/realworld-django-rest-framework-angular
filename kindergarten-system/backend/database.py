import json
import os
from datetime import datetime

DB_FILE = os.path.join(os.path.dirname(__file__), "data.json")

DEFAULT_DATA = {
    "admin": {
        "login": "993190712",
        "password": "12345678",
        "name": "Administrator"
    },
    "students": [],
    "payments": [],
    "groups": ["Kichkintoylar", "O'rtanchalar", "Kattalar", "Tayyorlov"]
}


def load_db():
    if not os.path.exists(DB_FILE):
        save_db(DEFAULT_DATA)
        return DEFAULT_DATA
    with open(DB_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_db(data):
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def get_next_id(collection):
    if not collection:
        return 1
    return max(item["id"] for item in collection) + 1
