
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ExpensesPage from "./pages/Expenses";
import SalesPage from "./pages/Sales";
import DepositsPage from "./pages/Deposits";
import ReportsPage from "./pages/Reports";
import SettingsPage from "./pages/Settings";
import AddTransactionPage from "./pages/AddTransaction";
import { useEffect } from "react";
import { initAuth } from "./lib/auth";
import { preloadSounds } from "./lib/audio";
import { useFinanceStore } from "./store/financeStore";

const queryClient = new QueryClient();

const AppContent = () => {
  const { fetchTransactions, fetchCategories } = useFinanceStore();
  
  // Initialize auth from localStorage and load data from backend
  useEffect(() => {
    // Initialize auth
    initAuth();
    
    // Load data from backend
    const loadData = async () => {
      try {
        await Promise.all([
          fetchTransactions(),
          fetchCategories()
        ]);
        console.log("Data loaded from backend");
      } catch (error) {
        console.error("Failed to load data from backend:", error);
      }
    };
    
    loadData();
    
    // Preload sound effects
    try {
      preloadSounds();
    } catch (error) {
      console.error("Failed to preload sounds:", error);
    }
  }, [fetchTransactions, fetchCategories]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Index />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/deposits" element={<DepositsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/add-transaction" element={<AddTransactionPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
