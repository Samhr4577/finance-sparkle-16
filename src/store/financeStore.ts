
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, TransactionInput } from './types';
import { defaultCategories } from './categoryData';
import { sampleTransactions } from './sampleData';
import { createTransactionOperations } from './transactionOperations';
import { createTransactionQueries } from './transactionQueries';

interface FinanceState {
  transactions: Transaction[];
  categories: Record<string, string[]>;
  
  // CRUD operations
  addTransaction: (transaction: TransactionInput) => void;
  updateTransaction: (id: string, updates: Partial<TransactionInput>) => void;
  deleteTransaction: (id: string) => void;
  
  // Category management
  addCategory: (type: string, categoryName: string) => void;
  updateCategory: (type: string, oldName: string, newName: string) => void;
  deleteCategory: (type: string, categoryName: string) => void;
  
  // Filters
  getTransactionsByType: (type: string) => Transaction[];
  getTransactionsByDateRange: (
    startDate: Date, 
    endDate: Date,
    type?: string
  ) => Transaction[];
  
  // Statistics
  getTotalByType: (type: string) => number;
  getRecentTransactions: (limit: number) => Transaction[];
  getCategoryTotals: (type: string) => Record<string, number>;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => {
      const operations = createTransactionOperations(
        () => ({ transactions: get().transactions }), 
        (fn) => set((state) => fn(state))
      );
      
      const queries = createTransactionQueries(() => ({ transactions: get().transactions }));
      
      return {
        transactions: sampleTransactions,
        categories: defaultCategories,
        ...operations,
        ...queries,
      };
    },
    {
      name: 'finance-store',
    }
  )
);

// Re-export types for convenience using 'export type' syntax
export type { Transaction, TransactionInput, DateRange, TransactionType } from './types';
