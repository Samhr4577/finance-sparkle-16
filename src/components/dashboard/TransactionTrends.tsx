
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo } from "react";
import { Transaction, TransactionType } from "@/store/financeStore";

interface TransactionTrendsProps {
  transactions: Transaction[];
  title: string;
  type?: TransactionType;
}

export function TransactionTrends({ transactions, title, type }: TransactionTrendsProps) {
  const chartData = useMemo(() => {
    // Group transactions by month
    const grouped = transactions
      .filter((transaction) => !type || transaction.type === type)
      .reduce((acc, transaction) => {
        const date = new Date(transaction.date);
        const month = date.toLocaleString("default", { month: "short" });
        
        if (!acc[month]) {
          acc[month] = { month, total: 0 };
        }
        
        acc[month].total += transaction.amount;
        return acc;
      }, {} as Record<string, { month: string; total: number }>);
    
    // Convert to array and sort by month
    return Object.values(grouped);
  }, [transactions, type]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
              <Legend />
              <Bar
                dataKey="total"
                fill="#0088FE"
                radius={[4, 4, 0, 0]}
                name="Amount"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
