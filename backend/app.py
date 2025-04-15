
from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import os
import json
from datetime import datetime
import uuid

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Database setup
DB_PATH = 'finance_tracker.db'

def init_db():
    if not os.path.exists(DB_PATH):
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Create transactions table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS transactions (
            id TEXT PRIMARY KEY,
            amount REAL NOT NULL,
            description TEXT NOT NULL,
            category TEXT NOT NULL,
            date TEXT NOT NULL,
            type TEXT NOT NULL,
            notes TEXT,
            timestamp TEXT NOT NULL
        )
        ''')
        
        # Create categories table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS categories (
            type TEXT NOT NULL,
            name TEXT NOT NULL,
            PRIMARY KEY (type, name)
        )
        ''')
        
        # Insert default categories
        default_categories = {
            "expense": ["Food", "Housing", "Transportation", "Entertainment", "Utilities", "Healthcare", "Shopping", "Education", "Personal", "Miscellaneous"],
            "sales-in": ["Salary", "Freelance", "Investments", "Gifts", "Other Income"],
            "sales-out": ["Materials", "Services", "Equipment", "Marketing", "Business Expenses"],
            "deposit": ["Savings", "Investment", "Emergency Fund", "Retirement", "Vacation Fund"]
        }
        
        for type, categories in default_categories.items():
            for category in categories:
                cursor.execute("INSERT INTO categories (type, name) VALUES (?, ?)", (type, category))
        
        conn.commit()
        conn.close()

# Initialize the database
init_db()

def dict_factory(cursor, row):
    """Convert database row to dictionary"""
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

# API Routes
@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = dict_factory
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM transactions ORDER BY date DESC")
    transactions = cursor.fetchall()
    conn.close()
    return jsonify(transactions)

@app.route('/api/transactions', methods=['POST'])
def add_transaction():
    data = request.json
    
    # Generate a unique ID if not provided
    if 'id' not in data:
        data['id'] = str(uuid.uuid4())
    
    # Ensure timestamp is present
    if 'timestamp' not in data:
        data['timestamp'] = datetime.now().isoformat()
    
    # Ensure notes field exists
    if 'notes' not in data:
        data['notes'] = ""
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO transactions (id, amount, description, category, date, type, notes, timestamp) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (data['id'], data['amount'], data['description'], data['category'], 
          data['date'], data['type'], data['notes'], data['timestamp']))
    conn.commit()
    conn.close()
    
    return jsonify({"success": True, "id": data['id']})

@app.route('/api/transactions/<id>', methods=['PUT'])
def update_transaction(id):
    data = request.json
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Update timestamp
    data['timestamp'] = datetime.now().isoformat()
    
    cursor.execute("""
    UPDATE transactions 
    SET amount=?, description=?, category=?, date=?, type=?, notes=?, timestamp=?
    WHERE id=?
    """, (data['amount'], data['description'], data['category'], 
          data['date'], data['type'], data['notes'], data['timestamp'], id))
    conn.commit()
    conn.close()
    
    return jsonify({"success": True})

@app.route('/api/transactions/<id>', methods=['DELETE'])
def delete_transaction(id):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM transactions WHERE id=?", (id,))
    conn.commit()
    conn.close()
    
    return jsonify({"success": True})

@app.route('/api/categories', methods=['GET'])
def get_categories():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT type, name FROM categories")
    categories_list = cursor.fetchall()
    conn.close()
    
    # Convert to the expected format
    categories = {
        "expense": [],
        "sales-in": [],
        "sales-out": [],
        "deposit": []
    }
    
    for category in categories_list:
        category_type, category_name = category
        if category_type in categories:
            categories[category_type].append(category_name)
    
    return jsonify(categories)

@app.route('/api/categories', methods=['POST'])
def add_category():
    data = request.json
    category_type = data.get('type')
    category_name = data.get('name')
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        cursor.execute("INSERT INTO categories (type, name) VALUES (?, ?)", 
                      (category_type, category_name))
        conn.commit()
        success = True
    except sqlite3.IntegrityError:
        # Category already exists
        success = False
    
    conn.close()
    
    return jsonify({"success": success})

@app.route('/api/categories/<type>/<old_name>', methods=['PUT'])
def update_category(type, old_name):
    data = request.json
    new_name = data.get('new_name')
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Update category in categories table
    cursor.execute("UPDATE categories SET name=? WHERE type=? AND name=?", 
                  (new_name, type, old_name))
    
    # Update category in transactions table
    cursor.execute("UPDATE transactions SET category=? WHERE type=? AND category=?", 
                  (new_name, type, old_name))
    
    conn.commit()
    conn.close()
    
    return jsonify({"success": True})

@app.route('/api/categories/<type>/<name>', methods=['DELETE'])
def delete_category(type, name):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM categories WHERE type=? AND name=?", (type, name))
    conn.commit()
    conn.close()
    
    return jsonify({"success": True})

@app.route('/api/reset', methods=['POST'])
def reset_database():
    # Delete the database file
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
    
    # Reinitialize the database
    init_db()
    
    return jsonify({"success": True, "message": "Database reset successfully"})

if __name__ == '__main__':
    app.run(debug=True)
