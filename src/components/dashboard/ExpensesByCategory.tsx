
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useMemo } from "react";
import { TransactionType, useFinanceStore } from "@/store/financeStore";
import { formatCurrency } from "@/lib/utils";

const COLORS = [
  "#0ea5e9", // Sky blue
  "#f97316", // Orange
  "#8b5cf6", // Purple
  "#10b981", // Emerald
  "#f43f5e", // Rose
  "#06b6d4", // Cyan
  "#6366f1", // Indigo
  "#84cc16", // Lime
  "#14b8a6", // Teal
  "#d946ef", // Fuchsia
];

interface ExpensesByCategoryProps {
  type: TransactionType;
  title: string;
}

export function ExpensesByCategory({ type, title }: ExpensesByCategoryProps) {
  const getCategoryTotals = useFinanceStore((state) => state.getCategoryTotals);

  const data = useMemo(() => {
    const totals = getCategoryTotals(type);
    return Object.entries(totals)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value); // Sort by value descending
  }, [getCategoryTotals, type]);

  const totalAmount = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="h-full transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => 
                  `${name}: ${(percent * 100).toFixed(1)}%`
                }
                animationBegin={200}
                animationDuration={800}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="hover:opacity-80 transition-opacity duration-200"
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "8px",
                  padding: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  border: "1px solid rgba(0,0,0,0.1)"
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry) => {
                  const { payload } = entry as any;
                  const itemValue = payload.value;
                  const percentage = ((itemValue / totalAmount) * 100).toFixed(1);
                  return `${value} (${percentage}%)`;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
