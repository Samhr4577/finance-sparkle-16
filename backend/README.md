
# Finance Tracker Backend

This is the Flask backend for the Finance Tracker application. It provides RESTful API endpoints to manage financial transactions and categories.

## Setup

1. Install Python 3.7 or higher
2. Create a virtual environment:
   ```
   python -m venv venv
   ```
3. Activate the virtual environment:
   - On Windows: `venv\Scripts\activate`
   - On macOS/Linux: `source venv/bin/activate`
4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
5. Run the application:
   ```
   python app.py
   ```

The server will start on http://localhost:5000

## API Endpoints

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create a new transaction
- `PUT /api/transactions/:id` - Update a transaction
- `DELETE /api/transactions/:id` - Delete a transaction

### Categories
- `GET /api/categories` - Get all categories grouped by type
- `POST /api/categories` - Create a new category
- `PUT /api/categories/:type/:old_name` - Update a category name
- `DELETE /api/categories/:type/:name` - Delete a category

### Database Management
- `POST /api/reset` - Reset the database with default data

## Database

The application uses SQLite for data storage. The database file `finance_tracker.db` will be created automatically in the project directory when the application first runs.
