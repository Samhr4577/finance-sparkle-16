
import { AppLayout } from "@/components/layout/AppLayout";
import { TransactionForm } from "@/components/transaction/TransactionForm";
import { useFinanceStore } from "@/store/financeStore";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AddTransactionPage() {
  const { addTransaction } = useFinanceStore();
  const navigate = useNavigate();
  
  const handleAddTransaction = (values: any) => {
    addTransaction(values);
    
    // Navigate based on transaction type
    switch (values.type) {
      case "expense":
        navigate("/expenses");
        break;
      case "sales-in":
      case "sales-out":
        navigate("/sales");
        break;
      case "deposit":
        navigate("/deposits");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Add New Transaction</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionForm onSubmit={handleAddTransaction} />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
