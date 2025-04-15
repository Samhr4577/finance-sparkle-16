
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Transaction, TransactionInput } from './types';
import { dateToString } from '@/lib/utils';

export const createTransactionOperations = (
  get: () => { transactions: Transaction[] },
  set: (fn: (state: { transactions: Transaction[]; categories: Record<string, string[]> }) => { 
    transactions: Transaction[];
    categories: Record<string, string[]>;
  }) => void
) => ({
  addTransaction: (transaction: TransactionInput) => {
    // Ensure date is converted to string format for storage
    const dateString = typeof transaction.date === 'string' 
      ? transaction.date 
      : dateToString(transaction.date);

    set((state) => ({
      ...state,
      transactions: [
        ...state.transactions,
        {
          ...transaction,
          date: dateString,
          id: uuidv4(),
          timestamp: new Date().toISOString(), // Add timestamp
        } as Transaction
      ]
    }));
    toast.success("Transaction added successfully");
  },

  updateTransaction: (id: string, updates: Partial<TransactionInput>) => {
    // Handle date conversion if it exists in updates
    const processedUpdates = { ...updates };
    if (updates.date !== undefined) {
      processedUpdates.date = typeof updates.date === 'string' 
        ? updates.date 
        : dateToString(updates.date);
    }

    set((state) => ({
      ...state,
      transactions: state.transactions.map((transaction) => 
        transaction.id === id 
          ? { 
              ...transaction, 
              ...processedUpdates,
              timestamp: new Date().toISOString() // Update timestamp
            } as Transaction
          : transaction
      )
    }));
    toast.success("Transaction updated successfully");
  },

  deleteTransaction: (id: string) => {
    set((state) => ({
      ...state,
      transactions: state.transactions.filter((transaction) => transaction.id !== id)
    }));
    toast.success("Transaction deleted successfully");
  },

  // New functions for category management
  addCategory: (type: string, categoryName: string) => {
    set((state) => {
      // Don't add if category already exists
      if (state.categories[type]?.includes(categoryName)) {
        toast.error("Category already exists");
        return state;
      }
      
      return {
        ...state,
        categories: {
          ...state.categories,
          [type]: [...(state.categories[type] || []), categoryName]
        }
      };
    });
    toast.success("Category added successfully");
  },
  
  updateCategory: (type: string, oldName: string, newName: string) => {
    set((state) => {
      // Check if category exists
      if (!state.categories[type]?.includes(oldName)) {
        toast.error("Category not found");
        return state;
      }
      
      // Check if new name already exists
      if (state.categories[type]?.includes(newName) && oldName !== newName) {
        toast.error("Category name already exists");
        return state;
      }
      
      // Update the category name
      const updatedCategories = {
        ...state.categories,
        [type]: state.categories[type].map(cat => 
          cat === oldName ? newName : cat
        )
      };
      
      // Also update all transactions using this category
      const updatedTransactions = state.transactions.map(transaction => {
        if (transaction.type === type && transaction.category === oldName) {
          return {
            ...transaction,
            category: newName,
            timestamp: new Date().toISOString()
          };
        }
        return transaction;
      });
      
      return {
        ...state,
        categories: updatedCategories,
        transactions: updatedTransactions
      };
    });
    toast.success("Category updated successfully");
  },
  
  deleteCategory: (type: string, categoryName: string) => {
    set((state) => {
      // Check if category exists
      if (!state.categories[type]?.includes(categoryName)) {
        toast.error("Category not found");
        return state;
      }
      
      // Remove the category
      const updatedCategories = {
        ...state.categories,
        [type]: state.categories[type].filter(cat => cat !== categoryName)
      };
      
      return {
        ...state,
        categories: updatedCategories
      };
    });
    toast.success("Category deleted successfully");
  }
});
