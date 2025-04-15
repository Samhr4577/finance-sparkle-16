
import { Transaction } from './types';

export const sampleTransactions: Transaction[] = [
  {
    id: "1",
    amount: 1250,
    description: "Monthly Salary",
    category: "Income",
    date: "2023-09-01",
    type: "sales-in",
    timestamp: "2023-09-01T09:00:00.000Z",
    notes: ""
  },
  {
    id: "2",
    amount: 45.99,
    description: "Groceries",
    category: "Food",
    date: "2023-09-03",
    type: "expense",
    timestamp: "2023-09-03T14:30:00.000Z",
    notes: ""
  },
  {
    id: "3",
    amount: 29.99,
    description: "Netflix Subscription",
    category: "Entertainment",
    date: "2023-09-05",
    type: "expense",
    timestamp: "2023-09-05T18:00:00.000Z",
    notes: ""
  },
  {
    id: "4",
    amount: 500,
    description: "Bank Deposit",
    category: "Savings",
    date: "2023-09-10",
    type: "deposit",
    timestamp: "2023-09-10T11:15:00.000Z",
    notes: ""
  },
  {
    id: "5",
    amount: 125,
    description: "Electricity Bill",
    category: "Utilities",
    date: "2023-09-15",
    type: "expense",
    timestamp: "2023-09-15T16:45:00.000Z",
    notes: ""
  },
  {
    id: "6",
    amount: 200,
    description: "Freelance Work",
    category: "Income",
    date: "2023-09-20",
    type: "sales-in",
    timestamp: "2023-09-20T10:30:00.000Z",
    notes: ""
  },
  {
    id: "7",
    amount: 75,
    description: "Restaurant Dinner",
    category: "Food",
    date: "2023-09-25",
    type: "expense",
    timestamp: "2023-09-25T19:20:00.000Z",
    notes: ""
  },
  {
    id: "8",
    amount: 350,
    description: "Online Purchase",
    category: "Shopping",
    date: "2023-09-28",
    type: "sales-out",
    timestamp: "2023-09-28T15:10:00.000Z",
    notes: ""
  },
];
