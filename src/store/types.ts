
export type TransactionType = 'expense' | 'sales-in' | 'sales-out' | 'deposit';
export type DateRange = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;  // Stored as YYYY-MM-DD string
  type: TransactionType;
  notes?: string;
  tags?: string[];
}

// Interface for adding new transactions that supports both string and Date types for date
export interface TransactionInput {
  amount: number;
  description: string;
  category: string;
  date: Date | string;
  type: TransactionType;
  notes?: string;
  tags?: string[];
}
