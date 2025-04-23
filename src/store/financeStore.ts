
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
            console.log('Fetching transactions from:', `${SUPABASE_URL}/rest/v1/transactions`);
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
            set({ transactions: data || [], isLoading: false });
          } catch (error) {
            console.error('Failed to fetch transactions:', error);
            // If we can't fetch from Supabase, initialize with an empty array
            set({ transactions: [], isLoading: false });
          }
        },
        
        fetchCategories: async () => {
          set({ isLoading: true });
          try {
            // Use Supabase instead of local API
            console.log('Fetching categories from:', `${SUPABASE_URL}/rest/v1/categories`);
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
            
            if (data && Array.isArray(data) && data.length > 0) {
              // Convert raw data from Supabase to the format we need
              const categoriesByType: Record<string, string[]> = {};
              
              data.forEach((category: { type: string, name: string }) => {
                if (!categoriesByType[category.type]) {
                  categoriesByType[category.type] = [];
                }
                categoriesByType[category.type].push(category.name);
              });
              
              set({ categories: categoriesByType, isLoading: false });
            } else {
              // Fall back to default categories if no data is returned
              console.log('No categories found in Supabase, using defaults');
              set({ categories: defaultCategories, isLoading: false });
            }
          } catch (error) {
            console.error('Failed to fetch categories:', error);
            // Fall back to default categories
            set({ categories: defaultCategories, isLoading: false });
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
