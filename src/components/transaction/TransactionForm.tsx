
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, CheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RippleButton } from "@/components/ui/ripple-button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useFinanceStore } from "@/store/financeStore";
import type { TransactionType } from "@/store/types";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";

const transactionSchema = z.object({
  amount: z.coerce.number().positive({ message: "Amount must be positive" }),
  description: z.string().min(1, { message: "Description is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  date: z.date(),
  notes: z.string().optional(),
  type: z.enum(["expense", "sales-in", "sales-out", "deposit"] as const),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  onSubmit: (values: TransactionFormValues) => void;
  defaultValues?: Partial<TransactionFormValues>;
  isEditing?: boolean;
}

export function TransactionForm({ 
  onSubmit, 
  defaultValues,
  isEditing = false 
}: TransactionFormProps) {
  const categories = useFinanceStore((state) => state.categories);
  const addCategory = useFinanceStore((state) => state.addCategory);

  const [selectedType, setSelectedType] = useState<TransactionType>(
    defaultValues?.type || "expense"
  );
  
  // Add state for custom category dialog
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  
  // Ensure form has proper default values and handle submit
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: defaultValues?.amount || 0,
      description: defaultValues?.description || "",
      category: defaultValues?.category || "",
      date: defaultValues?.date ? new Date(defaultValues.date) : new Date(),
      notes: defaultValues?.notes || "",
      type: defaultValues?.type || "expense",
    },
  });

  // When type changes, reset the category field if it doesn't exist in the new type's categories
  useEffect(() => {
    const currentCategory = form.getValues("category");
    const availableCategories = categories[selectedType] || [];
    
    if (currentCategory && !availableCategories.includes(currentCategory)) {
      form.setValue("category", "");
    }
  }, [selectedType, categories, form]);

  const handleTypeChange = (type: TransactionType) => {
    setSelectedType(type);
    form.setValue("type", type);
    
    // Only reset category when changing types if the category doesn't exist in the new type
    const currentCategory = form.getValues("category");
    const newTypeCategories = categories[type] || [];
    
    if (!newTypeCategories.includes(currentCategory)) {
      form.setValue("category", "");
    }
  };
  
  const typesMap = {
    "expense": { label: "Expense", color: "bg-red-500" },
    "sales-in": { label: "Income", color: "bg-green-500" },
    "sales-out": { label: "Outgoing", color: "bg-orange-500" },
    "deposit": { label: "Deposit", color: "bg-blue-500" },
  };
  
  // Ensure availableCategories is always an array, even if categories[selectedType] is undefined
  const availableCategories = categories[selectedType] || [];

  const handleSubmit = (values: TransactionFormValues) => {
    onSubmit(values);
  };
  
  // Add new category handler
  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory(selectedType, newCategory.trim());
      form.setValue("category", newCategory.trim());
      setNewCategory("");
      setIsAddingCategory(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                onClick={() => handleTypeChange(type)}
              >
                {label}
              </Button>
            ))
          }
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">
                      $
                    </span>
                    <Input {...field} className="pl-8" placeholder="0.00" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Transaction description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Category</FormLabel>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value && availableCategories.length > 0
                          ? availableCategories.find(
                              (category) => category === field.value
                            ) || "Select category"
                          : "Select category"}
                        <CheckIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search category..." />
                      <CommandEmpty>
                        <div className="p-2 text-center">
                          <p>No category found.</p>
                          <Button 
                            variant="outline" 
                            className="mt-2 w-full"
                            onClick={() => setIsAddingCategory(true)}
                          >
                            Add new category
                          </Button>
                        </div>
                      </CommandEmpty>
                      <CommandGroup>
                        {availableCategories.map((category) => (
                          <CommandItem
                            value={category}
                            key={category}
                            onSelect={() => {
                              form.setValue("category", category);
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                "mr-2 h-4 w-4",
                                category === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {category}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setIsAddingCategory(true)} 
                  className="shrink-0"
                >
                  +
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Additional details about this transaction"
                  className="resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <RippleButton type="submit" rippleColor="#7c9ef4">
            {isEditing ? "Update Transaction" : "Add Transaction"}
          </RippleButton>
        </div>
      </form>
      
      {/* Add Category Dialog */}
      <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="newCategory" className="text-sm font-medium">
                Category Name
              </label>
              <Input
                id="newCategory"
                placeholder="Enter category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingCategory(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory}>
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
