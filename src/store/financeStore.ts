
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, TransactionInput, TransactionType } from './types';
import { defaultCategories } from './categoryData';
import { sampleTransactions } from './sampleData';
import { createTransactionOperations } from './transactionOperations';
import { createTransactionQueries } from './transactionQueries';

interface FinanceState {
  transactions: Transaction[];
  categories: Record<TransactionType, string[]>;
  
  // CRUD operations
  addTransaction: (transaction: TransactionInput) => void;
  updateTransaction: (id: string, updates: Partial<TransactionInput>) => void;
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

// Re-export types for convenience
export { TransactionType, type Transaction, type TransactionInput, type DateRange } from './types';
