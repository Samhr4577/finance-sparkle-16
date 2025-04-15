
import { toast } from 'sonner';
import { Transaction, TransactionInput } from './types';
import { dateToString } from '@/lib/utils';

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
      const response = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      const response = await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
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
          transaction.id === id ? updatedTransaction : transaction
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
      const response = await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: 'DELETE',
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
      const response = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, name: categoryName }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add category');
      }
      
      // Fetch updated categories after adding a new one
      const categoriesResponse = await fetch('http://localhost:5000/api/categories');
      const categories = await categoriesResponse.json();
      
      set((state) => ({
        ...state,
        categories,
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
      const response = await fetch(`http://localhost:5000/api/categories/${type}/${oldName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update category');
      }
      
      // Fetch updated categories and transactions after updating a category
      const [categoriesResponse, transactionsResponse] = await Promise.all([
        fetch('http://localhost:5000/api/categories'),
        fetch('http://localhost:5000/api/transactions')
      ]);
      
      const [categories, transactions] = await Promise.all([
        categoriesResponse.json(),
        transactionsResponse.json()
      ]);
      
      set((state) => ({
        ...state,
        categories,
        transactions,
        isLoading: false
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
      const response = await fetch(`http://localhost:5000/api/categories/${type}/${categoryName}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete category');
      }
      
      // Fetch updated categories after deleting a category
      const categoriesResponse = await fetch('http://localhost:5000/api/categories');
      const categories = await categoriesResponse.json();
      
      set((state) => ({
        ...state,
        categories,
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
