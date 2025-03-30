
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DateRangeSelector } from "@/components/reporting/DateRangeSelector";
import { useFinanceStore } from "@/store/financeStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF",
  "#FF3D7F", "#32CD32", "#8B008B", "#FF6B6B", "#4CAF50"
];

export default function ReportsPage() {
  const { getTransactionsByDateRange, transactions } = useFinanceStore();
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(1)), // First day of current month
    to: new Date(), // Today
  });
  const [transactionType, setTransactionType] = useState<"all" | "expense" | "sales-in" | "sales-out" | "deposit">("all");

  const filteredTransactions = getTransactionsByDateRange(
    dateRange.from,
    dateRange.to
  ).filter((t) => transactionType === "all" || t.type === transactionType);

  // Process data for charts
  const dailyData = filteredTransactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { date, amount: 0, count: 0 };
    }
    acc[date].amount += transaction.amount;
    acc[date].count += 1;
    return acc;
  }, {} as Record<string, { date: string; amount: number; count: number }>);

  const dailyChartData = Object.values(dailyData).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const categoryData = filteredTransactions.reduce((acc, transaction) => {
    if (!acc[transaction.category]) {
      acc[transaction.category] = { name: transaction.category, value: 0 };
    }
    acc[transaction.category].value += transaction.amount;
    return acc;
  }, {} as Record<string, { name: string; value: number }>);

  const categoryChartData = Object.values(categoryData);

  const totalAmount = filteredTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <DateRangeSelector
              onChange={(range) => setDateRange(range)}
            />
            <Select
              value={transactionType}
              onValueChange={(value) => 
                setTransactionType(value as typeof transactionType)
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Transaction Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="expense">Expenses</SelectItem>
                <SelectItem value="sales-in">Income</SelectItem>
                <SelectItem value="sales-out">Outgoing</SelectItem>
                <SelectItem value="deposit">Deposits</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredTransactions.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Average Transaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  filteredTransactions.length
                    ? totalAmount / filteredTransactions.length
                    : 0
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Date Range</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="trends">
          <TabsList className="mb-4">
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={dailyChartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        name="Amount"
                        stroke="#0088FE"
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        name="Count"
                        stroke="#00C49F"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => 
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {categoryChartData.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={categoryChartData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis type="number" />
                        <YAxis
                          dataKey="name"
                          type="category"
                          width={100}
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Bar
                          dataKey="value"
                          fill="#0088FE"
                          name="Amount"
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
