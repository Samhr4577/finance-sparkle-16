
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
import { formatCurrency } from "@/lib/utils";

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
          acc[month] = { 
            month, 
            income: 0, 
            expenses: 0,
            deposits: 0,
            net: 0 
          };
        }
        
        const amount = transaction.amount;
        switch (transaction.type) {
          case "sales-in":
            acc[month].income += amount;
            acc[month].net += amount;
            break;
          case "expense":
            acc[month].expenses += amount;
            acc[month].net -= amount;
            break;
          case "deposit":
            acc[month].deposits += amount;
            break;
        }
        
        return acc;
      }, {} as Record<string, { 
        month: string; 
        income: number; 
        expenses: number;
        deposits: number;
        net: number;
      }>);
    
    // Convert to array and sort by month
    return Object.values(grouped);
  }, [transactions, type]);

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barGap={0}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${Math.abs(value)}`}
              />
              <Tooltip 
                formatter={(value: number) => formatCurrency(Math.abs(value))}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "8px",
                  padding: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  border: "1px solid rgba(0,0,0,0.1)"
                }}
              />
              <Legend />
              <Bar
                dataKey="income"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                name="Income"
                animationBegin={200}
                animationDuration={800}
              />
              <Bar
                dataKey="expenses"
                fill="#f43f5e"
                radius={[4, 4, 0, 0]}
                name="Expenses"
                animationBegin={400}
                animationDuration={800}
              />
              <Bar
                dataKey="deposits"
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
                name="Deposits"
                animationBegin={600}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
