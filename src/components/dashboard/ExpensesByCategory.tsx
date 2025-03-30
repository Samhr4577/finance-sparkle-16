
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useMemo } from "react";
import { TransactionType, useFinanceStore } from "@/store/financeStore";

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF",
  "#FF3D7F", "#32CD32", "#8B008B", "#FF6B6B", "#4CAF50"
];

interface ExpensesByCategoryProps {
  type: TransactionType;
  title: string;
}

export function ExpensesByCategory({ type, title }: ExpensesByCategoryProps) {
  const getCategoryTotals = useFinanceStore((state) => state.getCategoryTotals);

  const data = useMemo(() => {
    const totals = getCategoryTotals(type);
    return Object.entries(totals).map(([name, value]) => ({
      name,
      value,
    }));
  }, [getCategoryTotals, type]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => 
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
