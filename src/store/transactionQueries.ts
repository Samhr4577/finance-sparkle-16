
import { Transaction, TransactionType } from './types';

export const createTransactionQueries = (get: () => { transactions: Transaction[] }) => ({
  getTransactionsByType: (type: TransactionType) => {
    return get().transactions.filter((transaction) => transaction.type === type);
  },

  getTransactionsByDateRange: (
    startDate: Date, 
    endDate: Date,
    type?: TransactionType
  ) => {
    const start = startDate.setHours(0, 0, 0, 0);
    const end = endDate.setHours(23, 59, 59, 999);

    return get().transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date).getTime();
      const matchesType = type ? transaction.type === type : true;
      return transactionDate >= start && transactionDate <= end && matchesType;
    });
  },

  getTotalByType: (type: TransactionType) => {
    return get().transactions
      .filter((transaction) => transaction.type === type)
      .reduce((total, transaction) => total + transaction.amount, 0);
  },

  getRecentTransactions: (limit: number) => {
    if (!get().transactions || get().transactions.length === 0) {
      return [];
    }
    
    return [...get().transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  },

  getCategoryTotals: (type: TransactionType) => {
    return get().transactions
      .filter((transaction) => transaction.type === type)
      .reduce((acc, transaction) => {
        const { category, amount } = transaction;
        acc[category] = (acc[category] || 0) + amount;
        return acc;
      }, {} as Record<string, number>);
  },
});
