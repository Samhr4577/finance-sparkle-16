
import { Transaction } from './types';

export const sampleTransactions: Transaction[] = [
  {
    id: "1",
    amount: 1250,
    description: "Monthly Salary",
    category: "Income",
    date: "2023-09-01",
    type: "sales-in",
  },
  {
    id: "2",
    amount: 45.99,
    description: "Groceries",
    category: "Food",
    date: "2023-09-03",
    type: "expense",
  },
  {
    id: "3",
    amount: 29.99,
    description: "Netflix Subscription",
    category: "Entertainment",
    date: "2023-09-05",
    type: "expense",
  },
  {
    id: "4",
    amount: 500,
    description: "Bank Deposit",
    category: "Savings",
    date: "2023-09-10",
    type: "deposit",
  },
  {
    id: "5",
    amount: 125,
    description: "Electricity Bill",
    category: "Utilities",
    date: "2023-09-15",
    type: "expense",
  },
  {
    id: "6",
    amount: 200,
    description: "Freelance Work",
    category: "Income",
    date: "2023-09-20",
    type: "sales-in",
  },
  {
    id: "7",
    amount: 75,
    description: "Restaurant Dinner",
    category: "Food",
    date: "2023-09-25",
    type: "expense",
  },
  {
    id: "8",
    amount: 350,
    description: "Online Purchase",
    category: "Shopping",
    date: "2023-09-28",
    type: "sales-out",
  },
];
