
import { Transaction } from './types';

export const sampleTransactions: Transaction[] = [
  // Income transactions
  {
    id: "1",
    amount: 5000,
    description: "Monthly Salary",
    category: "Income",
    date: "2025-04-01",
    type: "sales-in",
    timestamp: "2025-04-01T09:00:00.000Z",
    notes: "Regular monthly salary"
  },
  {
    id: "2",
    amount: 2000,
    description: "Freelance Project",
    category: "Income",
    date: "2025-04-05",
    type: "sales-in",
    timestamp: "2025-04-05T15:30:00.000Z",
    notes: "Website development project"
  },
  // Expenses
  {
    id: "3",
    amount: 1200,
    description: "Rent Payment",
    category: "Housing",
    date: "2025-04-02",
    type: "expense",
    timestamp: "2025-04-02T10:00:00.000Z",
    notes: "Monthly rent"
  },
  {
    id: "4",
    amount: 350,
    description: "Grocery Shopping",
    category: "Food",
    date: "2025-04-03",
    type: "expense",
    timestamp: "2025-04-03T14:30:00.000Z",
    notes: "Weekly groceries"
  },
  {
    id: "5",
    amount: 80,
    description: "Electric Bill",
    category: "Utilities",
    date: "2025-04-04",
    type: "expense",
    timestamp: "2025-04-04T11:00:00.000Z",
    notes: "Monthly electricity"
  },
  {
    id: "6",
    amount: 60,
    description: "Internet Bill",
    category: "Utilities",
    date: "2025-04-04",
    type: "expense",
    timestamp: "2025-04-04T11:30:00.000Z",
    notes: "Monthly internet"
  },
  {
    id: "7",
    amount: 45,
    description: "Netflix Subscription",
    category: "Entertainment",
    date: "2025-04-05",
    type: "expense",
    timestamp: "2025-04-05T12:00:00.000Z",
    notes: "Monthly subscription"
  },
  {
    id: "8",
    amount: 30,
    description: "Spotify Premium",
    category: "Entertainment",
    date: "2025-04-05",
    type: "expense",
    timestamp: "2025-04-05T12:30:00.000Z",
    notes: "Monthly subscription"
  },
  // Savings and investments
  {
    id: "9",
    amount: 1000,
    description: "Investment Deposit",
    category: "Investments",
    date: "2025-04-06",
    type: "deposit",
    timestamp: "2025-04-06T09:00:00.000Z",
    notes: "Monthly investment contribution"
  },
  {
    id: "10",
    amount: 500,
    description: "Savings Transfer",
    category: "Savings",
    date: "2025-04-06",
    type: "deposit",
    timestamp: "2025-04-06T09:30:00.000Z",
    notes: "Emergency fund contribution"
  },
  // Shopping expenses
  {
    id: "11",
    amount: 120,
    description: "New Shoes",
    category: "Shopping",
    date: "2025-04-07",
    type: "expense",
    timestamp: "2025-04-07T15:00:00.000Z",
    notes: "Running shoes"
  },
  {
    id: "12",
    amount: 200,
    description: "Winter Coat",
    category: "Shopping",
    date: "2025-04-07",
    type: "expense",
    timestamp: "2025-04-07T16:00:00.000Z",
    notes: "Winter clothing"
  },
  // Transportation
  {
    id: "13",
    amount: 50,
    description: "Gas",
    category: "Transportation",
    date: "2025-04-08",
    type: "expense",
    timestamp: "2025-04-08T10:00:00.000Z",
    notes: "Weekly fuel"
  },
  {
    id: "14",
    amount: 75,
    description: "Car Insurance",
    category: "Transportation",
    date: "2025-04-08",
    type: "expense",
    timestamp: "2025-04-08T11:00:00.000Z",
    notes: "Monthly insurance payment"
  },
  // Additional income
  {
    id: "15",
    amount: 1500,
    description: "Bonus Payment",
    category: "Income",
    date: "2025-04-15",
    type: "sales-in",
    timestamp: "2025-04-15T14:00:00.000Z",
    notes: "Quarterly performance bonus"
  }
];
