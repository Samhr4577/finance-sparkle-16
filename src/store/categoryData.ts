
import { TransactionType } from './types';

export const defaultCategories: Record<TransactionType, string[]> = {
  'expense': ['Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 'Health', 'Education', 'Shopping', 'Travel', 'Other'],
  'sales-in': ['Salary', 'Freelance', 'Investments', 'Gifts', 'Refunds', 'Other Income'],
  'sales-out': ['Business Expenses', 'Inventory', 'Services', 'Equipment', 'Marketing', 'Other Expenses'],
  'deposit': ['Savings', 'Investments', 'Emergency Fund', 'Retirement', 'Education Fund', 'Other'],
};
