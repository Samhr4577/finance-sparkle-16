import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Transaction, TransactionInput } from './types';
import { dateToString } from '@/lib/utils';

export const createTransactionOperations = (
  get: () => { transactions: Transaction[], categories: Record<string, string[]> },
  set: (fn: (state: { transactions: Transaction[]; categories: Record<string, string[]> }) => { 
    transactions: Transaction[];
    categories: Record<string, string[]>;
  }) => void
) => ({
  addTransaction: (transaction: TransactionInput) => {
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
          timestamp: new Date().toISOString()
        } as Transaction
      ]
    }));
    toast.success("Transaction added successfully");
  },

  updateTransaction: (id: string, updates: Partial<TransactionInput>) => {
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
              timestamp: new Date().toISOString()
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

  addCategory: async (type: string, categoryName: string) => {
    try {
      const existingCategories = get().categories[type] || [];
      if (existingCategories.includes(categoryName)) {
        toast.error("Category already exists");
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast.error("You must be logged in to add a category");
        return;
      }

      const { data, error } = await supabase
        .from('categories')
        .insert({
          user_id: session.user.id,
          type: type,
          name: categoryName
        })
        .select();

      if (error) {
        toast.error(`Failed to add category: ${error.message}`);
        return;
      }

      set((state) => ({
        ...state,
        categories: {
          ...state.categories,
          [type]: [...(state.categories[type] || []), categoryName]
        }
      }));

      toast.success("Category added successfully");
    } catch (err) {
      console.error("Error adding category:", err);
      toast.error("An unexpected error occurred");
    }
  },

  updateCategory: async (type: string, oldName: string, newName: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast.error("You must be logged in to update a category");
        return;
      }

      const { data, error } = await supabase
        .from('categories')
        .select()
        .eq('user_id', session.user.id)
        .eq('type', type)
        .eq('name', oldName)
        .single();

      if (error || !data) {
        toast.error("Category not found");
        return;
      }

      const { error: updateError } = await supabase
        .from('categories')
        .update({ name: newName })
        .eq('id', data.id);

      if (updateError) {
        toast.error(`Failed to update category: ${updateError.message}`);
        return;
      }

      set((state) => {
        const updatedCategories = {
          ...state.categories,
          [type]: state.categories[type].map(cat => 
            cat === oldName ? newName : cat
          )
        };

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
    } catch (err) {
      console.error("Error updating category:", err);
      toast.error("An unexpected error occurred");
    }
  },

  deleteCategory: async (type: string, categoryName: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast.error("You must be logged in to delete a category");
        return;
      }

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('user_id', session.user.id)
        .eq('type', type)
        .eq('name', categoryName);

      if (error) {
        toast.error(`Failed to delete category: ${error.message}`);
        return;
      }

      set((state) => ({
        ...state,
        categories: {
          ...state.categories,
          [type]: state.categories[type].filter(cat => cat !== categoryName)
        }
      }));

      toast.success("Category deleted successfully");
    } catch (err) {
      console.error("Error deleting category:", err);
      toast.error("An unexpected error occurred");
    }
  }
});
