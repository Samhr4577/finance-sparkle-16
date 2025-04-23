
import { toast } from 'sonner';
import { Transaction, TransactionInput } from './types';
import { dateToString } from '@/lib/utils';

// Supabase URL and API key
const SUPABASE_URL = 'https://YOUR_SUPABASE_PROJECT_URL.supabase.co'; // Replace with your actual Supabase URL
const SUPABASE_API_KEY = 'YOUR_SUPABASE_API_KEY'; // Replace with your actual Supabase API key

export const createTransactionOperations = (
  get: () => { transactions: Transaction[]; categories: Record<string, string[]> },
  set: (fn: (state: { transactions: Transaction[]; categories: Record<string, string[]>; isLoading: boolean }) => { 
    transactions: Transaction[];
    categories: Record<string, string[]>;
    isLoading: boolean;
  }) => void
) => ({
  addTransaction: async (transaction: TransactionInput) => {
    set((state) => ({ ...state, isLoading: true }));
    
    // Ensure date is converted to string format for storage
    const dateString = typeof transaction.date === 'string' 
      ? transaction.date 
      : dateToString(transaction.date);
    
    const transactionToAdd = {
      ...transaction,
      date: dateString,
      timestamp: new Date().toISOString() // Add timestamp
    };
    
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_API_KEY,
          'Authorization': `Bearer ${SUPABASE_API_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(transactionToAdd),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add transaction');
      }
      
      const addedTransaction = await response.json();
      
      set((state) => ({
        ...state,
        transactions: [...state.transactions, addedTransaction],
        isLoading: false
      }));
      
      toast.success("Transaction added successfully");
    } catch (error) {
      console.error('Failed to add transaction:', error);
      toast.error("Failed to add transaction");
      set((state) => ({ ...state, isLoading: false }));
    }
  },

  updateTransaction: async (id: string, updates: Partial<TransactionInput>) => {
    set((state) => ({ ...state, isLoading: true }));
    
    // Handle date conversion if it exists in updates
    const processedUpdates = { ...updates };
    if (updates.date !== undefined) {
      processedUpdates.date = typeof updates.date === 'string' 
        ? updates.date 
        : dateToString(updates.date);
    }
    
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/transactions?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_API_KEY,
          'Authorization': `Bearer ${SUPABASE_API_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(processedUpdates),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update transaction');
      }
      
      const updatedTransaction = await response.json();
      
      set((state) => ({
        ...state,
        transactions: state.transactions.map((transaction) => 
          transaction.id === id ? updatedTransaction[0] : transaction
        ),
        isLoading: false
      }));
      
      toast.success("Transaction updated successfully");
    } catch (error) {
      console.error('Failed to update transaction:', error);
      toast.error("Failed to update transaction");
      set((state) => ({ ...state, isLoading: false }));
    }
  },

  deleteTransaction: async (id: string) => {
    set((state) => ({ ...state, isLoading: true }));
    
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/transactions?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_API_KEY,
          'Authorization': `Bearer ${SUPABASE_API_KEY}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete transaction');
      }
      
      set((state) => ({
        ...state,
        transactions: state.transactions.filter((transaction) => transaction.id !== id),
        isLoading: false
      }));
      
      toast.success("Transaction deleted successfully");
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      toast.error("Failed to delete transaction");
      set((state) => ({ ...state, isLoading: false }));
    }
  },

  addCategory: async (type: string, categoryName: string) => {
    set((state) => ({ ...state, isLoading: true }));
    
    try {
      // First, get the current categories for this type
      const currentCategories = get().categories[type] || [];
      
      // Check if category already exists
      if (currentCategories.includes(categoryName)) {
        toast.error("Category already exists");
        set((state) => ({ ...state, isLoading: false }));
        return;
      }
      
      // Update the categories in Supabase
      const response = await fetch(`${SUPABASE_URL}/rest/v1/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_API_KEY,
          'Authorization': `Bearer ${SUPABASE_API_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ type, name: categoryName }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add category');
      }
      
      // Update local state
      set((state) => ({
        ...state,
        categories: {
          ...state.categories,
          [type]: [...currentCategories, categoryName]
        },
        isLoading: false
      }));
      
      toast.success("Category added successfully");
    } catch (error) {
      console.error('Failed to add category:', error);
      toast.error("Failed to add category");
      set((state) => ({ ...state, isLoading: false }));
    }
  },
  
  updateCategory: async (type: string, oldName: string, newName: string) => {
    set((state) => ({ ...state, isLoading: true }));
    
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/categories?type=eq.${type}&name=eq.${oldName}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_API_KEY,
          'Authorization': `Bearer ${SUPABASE_API_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ name: newName }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update category');
      }
      
      // Update local state
      const currentCategories = get().categories[type] || [];
      const updatedCategories = currentCategories.map(cat => cat === oldName ? newName : cat);
      
      set((state) => ({
        ...state,
        categories: {
          ...state.categories,
          [type]: updatedCategories
        },
        isLoading: false
      }));
      
      // Also update any transactions using this category
      const transactions = get().transactions;
      const updatedTransactions = transactions.map(t => {
        if (t.type === type && t.category === oldName) {
          return { ...t, category: newName };
        }
        return t;
      });
      
      set((state) => ({
        ...state,
        transactions: updatedTransactions,
      }));
      
      toast.success("Category updated successfully");
    } catch (error) {
      console.error('Failed to update category:', error);
      toast.error("Failed to update category");
      set((state) => ({ ...state, isLoading: false }));
    }
  },
  
  deleteCategory: async (type: string, categoryName: string) => {
    set((state) => ({ ...state, isLoading: true }));
    
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/categories?type=eq.${type}&name=eq.${categoryName}`, {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_API_KEY,
          'Authorization': `Bearer ${SUPABASE_API_KEY}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete category');
      }
      
      // Update local state
      const currentCategories = get().categories[type] || [];
      const updatedCategories = currentCategories.filter(cat => cat !== categoryName);
      
      set((state) => ({
        ...state,
        categories: {
          ...state.categories,
          [type]: updatedCategories
        },
        isLoading: false
      }));
      
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error("Failed to delete category");
      set((state) => ({ ...state, isLoading: false }));
    }
  }
});
