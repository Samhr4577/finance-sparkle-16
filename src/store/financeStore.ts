
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

export type TransactionType = 'expense' | 'sales-in' | 'sales-out' | 'deposit';
export type DateRange = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: TransactionType;
  notes?: string;
  tags?: string[];
}

interface FinanceState {
  transactions: Transaction[];
  categories: Record<TransactionType, string[]>;
  
  // CRUD operations
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updates: Partial<Omit<Transaction, 'id'>>) => void;
  deleteTransaction: (id: string) => void;
  
  // Filters
  getTransactionsByType: (type: TransactionType) => Transaction[];
  getTransactionsByDateRange: (
    startDate: Date, 
    endDate: Date,
    type?: TransactionType
  ) => Transaction[];
  
  // Statistics
  getTotalByType: (type: TransactionType) => number;
  getRecentTransactions: (limit: number) => Transaction[];
  getCategoryTotals: (type: TransactionType) => Record<string, number>;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: [
        {
          id: "1",
          amount: 1250,
          description: "Monthly Salary",
          category: "Income",
          date: "2023-09-01",
          type: "sales-in",
        },
        {
          id: "2",
          amount: 45.99,
          description: "Groceries",
          category: "Food",
          date: "2023-09-03",
          type: "expense",
        },
        {
          id: "3",
          amount: 29.99,
          description: "Netflix Subscription",
          category: "Entertainment",
          date: "2023-09-05",
          type: "expense",
        },
        {
          id: "4",
          amount: 500,
          description: "Bank Deposit",
          category: "Savings",
          date: "2023-09-10",
          type: "deposit",
        },
        {
          id: "5",
          amount: 125,
          description: "Electricity Bill",
          category: "Utilities",
          date: "2023-09-15",
          type: "expense",
        },
        {
          id: "6",
          amount: 200,
          description: "Freelance Work",
          category: "Income",
          date: "2023-09-20",
          type: "sales-in",
        },
        {
          id: "7",
          amount: 75,
          description: "Restaurant Dinner",
          category: "Food",
          date: "2023-09-25",
          type: "expense",
        },
        {
          id: "8",
          amount: 350,
          description: "Online Purchase",
          category: "Shopping",
          date: "2023-09-28",
          type: "sales-out",
        },
      ],
      
      categories: {
        'expense': ['Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 'Health', 'Education', 'Shopping', 'Travel', 'Other'],
        'sales-in': ['Salary', 'Freelance', 'Investments', 'Gifts', 'Refunds', 'Other Income'],
        'sales-out': ['Business Expenses', 'Inventory', 'Services', 'Equipment', 'Marketing', 'Other Expenses'],
        'deposit': ['Savings', 'Investments', 'Emergency Fund', 'Retirement', 'Education Fund', 'Other'],
      },

      addTransaction: (transaction) => {
        set(state => ({
          transactions: [
            ...state.transactions,
            {
              ...transaction,
              id: uuidv4(),
            }
          ]
        }));
        toast.success("Transaction added successfully");
      },

      updateTransaction: (id, updates) => {
        set(state => ({
          transactions: state.transactions.map(transaction => 
            transaction.id === id 
              ? { ...transaction, ...updates }
              : transaction
          )
        }));
        toast.success("Transaction updated successfully");
      },

      deleteTransaction: (id) => {
        set(state => ({
          transactions: state.transactions.filter(transaction => transaction.id !== id)
        }));
        toast.success("Transaction deleted successfully");
      },

      getTransactionsByType: (type) => {
        return get().transactions.filter(transaction => transaction.type === type);
      },

      getTransactionsByDateRange: (startDate, endDate, type) => {
        const start = startDate.setHours(0, 0, 0, 0);
        const end = endDate.setHours(23, 59, 59, 999);

        return get().transactions.filter(transaction => {
          const transactionDate = new Date(transaction.date).getTime();
          const matchesType = type ? transaction.type === type : true;
          return transactionDate >= start && transactionDate <= end && matchesType;
        });
      },

      getTotalByType: (type) => {
        return get().transactions
          .filter(transaction => transaction.type === type)
          .reduce((total, transaction) => total + transaction.amount, 0);
      },

      getRecentTransactions: (limit) => {
        return [...get().transactions]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, limit);
      },

      getCategoryTotals: (type) => {
        return get().transactions
          .filter(transaction => transaction.type === type)
          .reduce((acc, transaction) => {
            const { category, amount } = transaction;
            acc[category] = (acc[category] || 0) + amount;
            return acc;
          }, {} as Record<string, number>);
      },
    }),
    {
      name: 'finance-store',
    }
  )
);
