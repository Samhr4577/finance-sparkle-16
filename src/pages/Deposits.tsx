
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

export default function DepositsPage() {
  const { getTransactionsByType, updateTransaction, deleteTransaction } = useFinanceStore();
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  const deposits = getTransactionsByType("deposit");
  
  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteTransaction = (id: string) => {
    const transaction = deposits.find(t => t.id === id);
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
          <h1 className="text-3xl font-bold">Bank Deposits</h1>
        </div>
        
        <TransactionTable
          transactions={deposits}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
          type="deposit"
          title="All Deposits"
        />
        
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Deposit</DialogTitle>
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
                Are you sure you want to delete this deposit?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the 
                deposit record.
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
