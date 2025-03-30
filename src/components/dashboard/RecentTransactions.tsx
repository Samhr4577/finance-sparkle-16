
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownIcon, ArrowUpIcon, PiggyBankIcon, ShoppingCartIcon } from "lucide-react";
import { Transaction, TransactionType } from "@/store/financeStore";
import { formatCurrency } from "@/lib/utils";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const getTransactionIcon = (type: TransactionType) => {
  switch (type) {
    case "expense":
      return <ShoppingCartIcon className="h-4 w-4 text-red-500" />;
    case "sales-in":
      return <ArrowUpIcon className="h-4 w-4 text-green-500" />;
    case "sales-out":
      return <ArrowDownIcon className="h-4 w-4 text-orange-500" />;
    case "deposit":
      return <PiggyBankIcon className="h-4 w-4 text-blue-500" />;
  }
};

const getTransactionTypeLabel = (type: TransactionType) => {
  switch (type) {
    case "expense":
      return { label: "Expense", variant: "destructive" as const };
    case "sales-in":
      return { label: "Income", variant: "success" as const };
    case "sales-out":
      return { label: "Outgoing", variant: "warning" as const };
    case "deposit":
      return { label: "Deposit", variant: "default" as const };
  }
};

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => {
              const typeInfo = getTransactionTypeLabel(transaction.type);
              return (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <Badge variant={typeInfo.variant} className="flex gap-1 items-center">
                      {getTransactionIcon(transaction.type)}
                      <span className="hidden sm:inline-block">{typeInfo.label}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
