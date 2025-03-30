
import { useAuthStore } from "@/lib/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { ExpensesByCategory } from "@/components/dashboard/ExpensesByCategory";
import { TransactionTrends } from "@/components/dashboard/TransactionTrends";
import { ArrowDownIcon, ArrowUpIcon, PiggyBankIcon } from "lucide-react";
import { useFinanceStore } from "@/store/financeStore";
import { formatCurrency } from "@/lib/utils";

const Dashboard = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { 
    getTotalByType, 
    getRecentTransactions,
    transactions,
  } = useFinanceStore();
  
  const totalExpenses = getTotalByType("expense");
  const totalIncome = getTotalByType("sales-in");
  const totalDeposits = getTotalByType("deposit");
  const netIncome = totalIncome - totalExpenses;
  
  const recentTransactions = getRecentTransactions(5);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Income"
            value={formatCurrency(totalIncome)}
            icon={<ArrowUpIcon className="h-4 w-4" />}
            trend="up"
            trendValue="4.5%"
          />
          <StatCard
            title="Total Expenses"
            value={formatCurrency(totalExpenses)}
            icon={<ArrowDownIcon className="h-4 w-4" />}
            trend="down"
            trendValue="2.1%"
          />
          <StatCard
            title="Net Income"
            value={formatCurrency(netIncome)}
            trend={netIncome > 0 ? "up" : "down"}
            trendValue={netIncome > 0 ? "8.2%" : "3.1%"}
          />
          <StatCard
            title="Total Deposits"
            value={formatCurrency(totalDeposits)}
            icon={<PiggyBankIcon className="h-4 w-4" />}
            trend="up"
            trendValue="12.5%"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TransactionTrends 
            transactions={transactions} 
            title="Monthly Income & Expenses" 
          />
          <div className="grid grid-cols-1 gap-6">
            <ExpensesByCategory type="expense" title="Expenses by Category" />
          </div>
        </div>
        
        <RecentTransactions transactions={recentTransactions} />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
