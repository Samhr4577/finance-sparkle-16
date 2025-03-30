
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { TransactionTable } from "@/components/transaction/TransactionTable";
import { Transaction, useFinanceStore } from "@/store/financeStore";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { TransactionForm } from "@/components/transaction/TransactionForm";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SalesPage() {
  const { getTransactionsByType, updateTransaction, deleteTransaction } = useFinanceStore();
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  const salesIn = getTransactionsByType("sales-in");
  const salesOut = getTransactionsByType("sales-out");
  
  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteTransaction = (id: string) => {
    const transaction = [...salesIn, ...salesOut].find(t => t.id === id);
    if (transaction) {
      setSelectedTransaction(transaction);
      setIsDeleteDialogOpen(true);
    }
  };
  
  const handleUpdateTransaction = (values: Omit<Transaction, "id">) => {
    if (selectedTransaction) {
      updateTransaction(selectedTransaction.id, values);
      setIsEditDialogOpen(false);
    }
  };
  
  const confirmDelete = () => {
    if (selectedTransaction) {
      deleteTransaction(selectedTransaction.id);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Sales Tracker</h1>
        </div>
        
        <Tabs defaultValue="sales-in">
          <TabsList className="w-full max-w-md mb-6">
            <TabsTrigger value="sales-in" className="flex-1">Sales In (Income)</TabsTrigger>
            <TabsTrigger value="sales-out" className="flex-1">Sales Out (Expenses)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales-in">
            <TransactionTable
              transactions={salesIn}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
              type="sales-in"
              title="All Income"
            />
          </TabsContent>
          
          <TabsContent value="sales-out">
            <TransactionTable
              transactions={salesOut}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
              type="sales-out"
              title="All Outgoing Sales"
            />
          </TabsContent>
        </Tabs>
        
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Transaction</DialogTitle>
            </DialogHeader>
            {selectedTransaction && (
              <TransactionForm
                onSubmit={handleUpdateTransaction}
                defaultValues={selectedTransaction}
                isEditing={true}
              />
            )}
          </DialogContent>
        </Dialog>
        
        <AlertDialog 
          open={isDeleteDialogOpen} 
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete this transaction?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the 
                transaction record.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
