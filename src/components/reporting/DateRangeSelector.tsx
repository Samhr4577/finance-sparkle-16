
import { useState, useCallback } from "react";
import { addDays, format, startOfDay, startOfMonth, startOfWeek, subDays, subMonths, subWeeks } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateRangeSelectorProps {
  onChange: (dateRange: { from: Date; to: Date }) => void;
}

export function DateRangeSelector({ onChange }: DateRangeSelectorProps) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfDay(subDays(new Date(), 30)),
    to: startOfDay(new Date()),
  });

  const handleSelect = useCallback((preset: string) => {
    const today = startOfDay(new Date());
    
    let from: Date;
    let to = today;
    
    switch (preset) {
      case "today":
        from = today;
        break;
      case "yesterday":
        from = subDays(today, 1);
        to = subDays(today, 1);
        break;
      case "7days":
        from = subDays(today, 6);
        break;
      case "30days":
        from = subDays(today, 29);
        break;
      case "thisWeek":
        from = startOfWeek(today, { weekStartsOn: 1 });
        break;
      case "thisMonth":
        from = startOfMonth(today);
        break;
      case "lastMonth":
        const lastMonth = subMonths(today, 1);
        from = startOfMonth(lastMonth);
        to = addDays(startOfMonth(today), -1);
        break;
      default:
        return;
    }
    
    const newRange = { from, to };
    setDate(newRange);
    onChange(newRange);
  }, [onChange]);

  const handleCalendarSelect = useCallback((range: DateRange | undefined) => {
    if (range?.from) {
      const newRange = {
        from: range.from,
        to: range.to || range.from
      };
      setDate(newRange);
      onChange(newRange);
    }
  }, [onChange]);

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Select onValueChange={handleSelect}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="yesterday">Yesterday</SelectItem>
          <SelectItem value="7days">Last 7 days</SelectItem>
          <SelectItem value="30days">Last 30 days</SelectItem>
          <SelectItem value="thisWeek">This week</SelectItem>
          <SelectItem value="thisMonth">This month</SelectItem>
          <SelectItem value="lastMonth">Last month</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleCalendarSelect}
            numberOfMonths={2}
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
