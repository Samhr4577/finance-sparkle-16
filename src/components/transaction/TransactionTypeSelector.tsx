
import { Button } from "@/components/ui/button";
import { TransactionType } from "@/store/types";
import { cn } from "@/lib/utils";

interface TransactionTypeSelectorProps {
  selectedType: TransactionType;
  onTypeChange: (type: TransactionType) => void;
}

export function TransactionTypeSelector({
  selectedType,
  onTypeChange,
}: TransactionTypeSelectorProps) {
  const typesMap = {
    "expense": { label: "Expense", color: "bg-red-500" },
    "sales-in": { label: "Income", color: "bg-green-500" },
    "sales-out": { label: "Outgoing", color: "bg-orange-500" },
    "deposit": { label: "Deposit", color: "bg-blue-500" },
  };

  return (
    <div className="flex flex-wrap gap-2">
      {(Object.entries(typesMap) as Array<[TransactionType, { label: string, color: string }]>)
        .map(([type, { label, color }]) => (
          <Button
            key={type}
            type="button"
            variant={selectedType === type ? "default" : "outline"}
            className={cn(
              "flex-1 min-w-[100px]",
              selectedType === type && color
            )}
            onClick={() => onTypeChange(type)}
          >
            {label}
          </Button>
        ))
      }
    </div>
  );
}
