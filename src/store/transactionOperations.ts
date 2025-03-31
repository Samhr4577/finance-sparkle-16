
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Transaction, TransactionInput } from './types';
import { dateToString } from '@/lib/utils';

export const createTransactionOperations = (
  get: () => { transactions: Transaction[] },
  set: (fn: (state: { transactions: Transaction[] }) => { transactions: Transaction[] }) => void
) => ({
  addTransaction: (transaction: TransactionInput) => {
    // Ensure date is converted to string format for storage
    const dateString = typeof transaction.date === 'string' 
      ? transaction.date 
      : dateToString(transaction.date);

    set((state) => ({
      transactions: [
        ...state.transactions,
        {
          ...transaction,
          date: dateString,
          id: uuidv4(),
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
      transactions: state.transactions.map((transaction) => 
        transaction.id === id 
          ? { ...transaction, ...processedUpdates } as Transaction
          : transaction
      )
    }));
    toast.success("Transaction updated successfully");
  },

  deleteTransaction: (id: string) => {
    set((state) => ({
      transactions: state.transactions.filter((transaction) => transaction.id !== id)
    }));
    toast.success("Transaction deleted successfully");
  },
});
