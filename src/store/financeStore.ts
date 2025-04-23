
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, TransactionInput } from './types';
import { defaultCategories } from './categoryData';
import { createTransactionOperations } from './transactionOperations';
import { createTransactionQueries } from './transactionQueries';

// Supabase URL and API key
const SUPABASE_URL = 'https://YOUR_SUPABASE_PROJECT_URL.supabase.co'; // Replace with your actual Supabase URL
const SUPABASE_API_KEY = 'YOUR_SUPABASE_API_KEY'; // Replace with your actual Supabase API key

interface FinanceState {
  transactions: Transaction[];
  categories: Record<string, string[]>;
  isLoading: boolean;
  
  // CRUD operations
  addTransaction: (transaction: TransactionInput) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<TransactionInput>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  
  // Category management
  addCategory: (type: string, categoryName: string) => Promise<void>;
  updateCategory: (type: string, oldName: string, newName: string) => Promise<void>;
  deleteCategory: (type: string, categoryName: string) => Promise<void>;
  
  // Data loading
  fetchTransactions: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  
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
        () => ({ 
          transactions: get().transactions, 
          categories: get().categories 
        }), 
        (fn) => set((state) => fn(state))
      );
      
      const queries = createTransactionQueries(() => ({ transactions: get().transactions }));
      
      return {
        transactions: [],
        categories: defaultCategories,
        isLoading: false,
        ...operations,
        ...queries,
        
        fetchTransactions: async () => {
          set({ isLoading: true });
          try {
            // Use Supabase instead of local API
            const response = await fetch(`${SUPABASE_URL}/rest/v1/transactions`, {
              headers: {
                'apikey': SUPABASE_API_KEY,
                'Authorization': `Bearer ${SUPABASE_API_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
              }
            });
            
            if (!response.ok) {
              throw new Error(`Failed to fetch transactions: ${response.statusText}`);
            }
            
            const data = await response.json();
            set({ transactions: data, isLoading: false });
          } catch (error) {
            console.error('Failed to fetch transactions:', error);
            set({ isLoading: false });
          }
        },
        
        fetchCategories: async () => {
          set({ isLoading: true });
          try {
            // Use Supabase instead of local API
            const response = await fetch(`${SUPABASE_URL}/rest/v1/categories`, {
              headers: {
                'apikey': SUPABASE_API_KEY,
                'Authorization': `Bearer ${SUPABASE_API_KEY}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (!response.ok) {
              throw new Error(`Failed to fetch categories: ${response.statusText}`);
            }
            
            const data = await response.json();
            set({ categories: data, isLoading: false });
          } catch (error) {
            console.error('Failed to fetch categories:', error);
            set({ isLoading: false });
            // Fall back to default categories
            set({ categories: defaultCategories });
          }
        }
      };
    },
    {
      name: 'finance-store',
    }
  )
);

// Re-export types for convenience using 'export type' syntax
export type { Transaction, TransactionInput, DateRange, TransactionType } from './types';
