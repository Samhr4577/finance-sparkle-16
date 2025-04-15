
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid
import os

app = Flask(__name__)
# Configure CORS to allow requests from your React app
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///finance_tracker.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Models
class Transaction(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(10), nullable=False)  # YYYY-MM-DD
    type = db.Column(db.String(20), nullable=False)  # expense, sales-in, sales-out, deposit
    notes = db.Column(db.Text, nullable=True)
    timestamp = db.Column(db.String(30), nullable=False)  # ISO format
    
    def to_dict(self):
        return {
            'id': self.id,
            'amount': self.amount,
            'description': self.description,
            'category': self.category,
            'date': self.date,
            'type': self.type,
            'notes': self.notes,
            'timestamp': self.timestamp
        }

class Category(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    type = db.Column(db.String(20), nullable=False)  # expense, sales-in, sales-out, deposit
    name = db.Column(db.String(100), nullable=False)
    
    __table_args__ = (db.UniqueConstraint('type', 'name'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type,
            'name': self.name
        }

# Routes for Transactions
@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    transactions = Transaction.query.all()
    return jsonify([t.to_dict() for t in transactions])

@app.route('/api/transactions', methods=['POST'])
def add_transaction():
    data = request.json
    
    # Generate a UUID for the new transaction
    transaction_id = str(uuid.uuid4())
    
    # Create a timestamp if not provided
    if 'timestamp' not in data:
        data['timestamp'] = datetime.now().isoformat()
    
    transaction = Transaction(
        id=transaction_id,
        amount=data['amount'],
        description=data['description'],
        category=data['category'],
        date=data['date'] if isinstance(data['date'], str) else data['date'].split('T')[0],
        type=data['type'],
        notes=data.get('notes', ''),
        timestamp=data['timestamp']
    )
    
    db.session.add(transaction)
    db.session.commit()
    
    return jsonify(transaction.to_dict()), 201

@app.route('/api/transactions/<string:id>', methods=['PUT'])
def update_transaction(id):
    data = request.json
    transaction = Transaction.query.get(id)
    
    if not transaction:
        return jsonify({'error': 'Transaction not found'}), 404
    
    transaction.amount = data.get('amount', transaction.amount)
    transaction.description = data.get('description', transaction.description)
    transaction.category = data.get('category', transaction.category)
    transaction.date = data.get('date', transaction.date)
    transaction.type = data.get('type', transaction.type)
    transaction.notes = data.get('notes', transaction.notes)
    transaction.timestamp = datetime.now().isoformat()
    
    db.session.commit()
    
    return jsonify(transaction.to_dict())

@app.route('/api/transactions/<string:id>', methods=['DELETE'])
def delete_transaction(id):
    transaction = Transaction.query.get(id)
    
    if not transaction:
        return jsonify({'error': 'Transaction not found'}), 404
    
    db.session.delete(transaction)
    db.session.commit()
    
    return jsonify({'message': 'Transaction deleted successfully'})

# Routes for Categories
@app.route('/api/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    
    # Group categories by type
    category_dict = {}
    for category in categories:
        if category.type not in category_dict:
            category_dict[category.type] = []
        category_dict[category.type].append(category.name)
    
    return jsonify(category_dict)

@app.route('/api/categories', methods=['POST'])
def add_category():
    data = request.json
    
    # Check if category already exists
    existing = Category.query.filter_by(type=data['type'], name=data['name']).first()
    if existing:
        return jsonify({'error': 'Category already exists'}), 400
    
    category = Category(
        id=str(uuid.uuid4()),
        type=data['type'],
        name=data['name']
    )
    
    db.session.add(category)
    db.session.commit()
    
    return jsonify(category.to_dict()), 201

@app.route('/api/categories/<string:type>/<string:old_name>', methods=['PUT'])
def update_category(type, old_name):
    data = request.json
    new_name = data['name']
    
    # Find the category to update
    category = Category.query.filter_by(type=type, name=old_name).first()
    
    if not category:
        return jsonify({'error': 'Category not found'}), 404
    
    # Check if new name already exists
    if old_name != new_name:
        existing = Category.query.filter_by(type=type, name=new_name).first()
        if existing:
            return jsonify({'error': 'Category name already exists'}), 400
    
    category.name = new_name
    
    # Also update all transactions using this category
    transactions = Transaction.query.filter_by(type=type, category=old_name).all()
    for transaction in transactions:
        transaction.category = new_name
    
    db.session.commit()
    
    return jsonify(category.to_dict())

@app.route('/api/categories/<string:type>/<string:name>', methods=['DELETE'])
def delete_category(type, name):
    category = Category.query.filter_by(type=type, name=name).first()
    
    if not category:
        return jsonify({'error': 'Category not found'}), 404
    
    db.session.delete(category)
    db.session.commit()
    
    return jsonify({'message': 'Category deleted successfully'})

# Initialize the database with default categories
@app.route('/api/reset', methods=['POST'])
def reset_db():
    db.drop_all()
    db.create_all()
    
    # Add default categories
    default_categories = {
        'expense': ['Food', 'Transportation', 'Entertainment', 'Utilities', 'Housing', 'Healthcare', 'Education', 'Personal', 'Miscellaneous'],
        'sales-in': ['Income', 'Freelance', 'Gifts', 'Investments', 'Side Hustle'],
        'sales-out': ['Inventory', 'Marketing', 'Operations', 'Tools', 'Services', 'Contractors'],
        'deposit': ['Savings', 'Investment', 'Emergency Fund', 'Retirement', 'Vacation']
    }
    
    for type, categories in default_categories.items():
        for category_name in categories:
            db.session.add(Category(
                id=str(uuid.uuid4()),
                type=type,
                name=category_name
            ))
    
    # Add sample transactions
    sample_transactions = [
        {
            'id': "1",
            'amount': 1250,
            'description': "Monthly Salary",
            'category': "Income",
            'date': "2023-09-01",
            'type': "sales-in",
            'timestamp': "2023-09-01T12:00:00.000Z"
        },
        {
            'id': "2",
            'amount': 45.99,
            'description': "Groceries",
            'category': "Food",
            'date': "2023-09-03",
            'type': "expense",
            'timestamp': "2023-09-03T12:00:00.000Z"
        },
        {
            'id': "3",
            'amount': 29.99,
            'description': "Netflix Subscription",
            'category': "Entertainment",
            'date': "2023-09-05",
            'type': "expense",
            'timestamp': "2023-09-05T12:00:00.000Z"
        },
        {
            'id': "4",
            'amount': 500,
            'description': "Bank Deposit",
            'category': "Savings",
            'date': "2023-09-10",
            'type': "deposit",
            'timestamp': "2023-09-10T12:00:00.000Z"
        },
        {
            'id': "5",
            'amount': 125,
            'description': "Electricity Bill",
            'category': "Utilities",
            'date': "2023-09-15",
            'type': "expense",
            'timestamp': "2023-09-15T12:00:00.000Z"
        },
        {
            'id': "6",
            'amount': 200,
            'description': "Freelance Work",
            'category': "Income",
            'date': "2023-09-20",
            'type': "sales-in",
            'timestamp': "2023-09-20T12:00:00.000Z"
        },
        {
            'id': "7",
            'amount': 75,
            'description': "Restaurant Dinner",
            'category': "Food",
            'date': "2023-09-25",
            'type': "expense",
            'timestamp': "2023-09-25T12:00:00.000Z"
        },
        {
            'id': "8",
            'amount': 350,
            'description': "Online Purchase",
            'category': "Shopping",
            'date': "2023-09-28",
            'type': "sales-out",
            'timestamp': "2023-09-28T12:00:00.000Z"
        }
    ]
    
    for t in sample_transactions:
        db.session.add(Transaction(**t))
    
    db.session.commit()
    
    return jsonify({'message': 'Database reset with default data'})

# Create a simple index route
@app.route('/')
def index():
    return jsonify({
        'message': 'Finance Tracker API is running',
        'endpoints': {
            'GET /api/transactions': 'Get all transactions',
            'POST /api/transactions': 'Add a new transaction',
            'PUT /api/transactions/:id': 'Update a transaction',
            'DELETE /api/transactions/:id': 'Delete a transaction',
            'GET /api/categories': 'Get all categories grouped by type',
            'POST /api/categories': 'Add a new category',
            'PUT /api/categories/:type/:old_name': 'Update a category',
            'DELETE /api/categories/:type/:name': 'Delete a category',
            'POST /api/reset': 'Reset the database with default data'
        }
    })

# Run the server
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
        # Check if we need to initialize default data
        if Category.query.count() == 0:
            # Trigger the reset endpoint to add default data
            with app.test_client() as client:
                client.post('/api/reset')
                
    app.run(debug=True, port=5000)
