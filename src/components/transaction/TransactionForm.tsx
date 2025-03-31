
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RippleButton } from "@/components/ui/ripple-button";
import { useFinanceStore } from "@/store/financeStore";
import { TransactionType } from "@/store/types";
import { supabase } from "@/integrations/supabase/client";
import { dateToString } from "@/lib/utils";

import { TransactionTypeSelector } from "./TransactionTypeSelector";
import { CategorySelector } from "./CategorySelector";
import { AmountDateFields } from "./AmountDateFields";
import { transactionSchema, TransactionFormValues } from "./transactionFormSchema";

export type { TransactionFormValues } from "./transactionFormSchema";

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
  
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: defaultValues?.amount || 0,
      description: defaultValues?.description || "",
      category: defaultValues?.category || "",
      date: defaultValues?.date ? new Date(defaultValues.date) : new Date(),
      notes: defaultValues?.notes || "",
      type: defaultValues?.type || "expense",
      timestamp: defaultValues?.timestamp || new Date().toISOString(),
    },
  });

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
    
    const currentCategory = form.getValues("category");
    const newTypeCategories = categories[type] || [];
    
    if (!newTypeCategories.includes(currentCategory)) {
      form.setValue("category", "");
    }
  };

  // Ensure we have a valid array for categories
  const availableCategories = categories[selectedType] || [];

  const handleSubmit = async (values: TransactionFormValues) => {
    const valuesWithTimestamp = {
      ...values,
      timestamp: values.timestamp || new Date().toISOString()
    };
    
    try {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        const transactionData = {
          amount: values.amount,
          description: values.description,
          category: values.category,
          transaction_date: values.date.toISOString(),
          transaction_type: mapTransactionType(values.type),
          user_id: session.session.user.id
        };
        
        const { error } = await supabase
          .from('transactions')
          .insert(transactionData);
        
        if (error) {
          console.error('Error saving to Supabase:', error);
          toast.error('Failed to save to database. Saving locally only.');
        } else {
          toast.success('Transaction saved to database!');
        }
      }
    } catch (error) {
      console.error('Error in Supabase operation:', error);
    }
    
    onSubmit(valuesWithTimestamp);
  };

  const mapTransactionType = (type: TransactionType): string => {
    switch (type) {
      case 'expense':
        return 'expense';
      case 'sales-in':
        return 'income';
      case 'deposit':
        return 'deposit';
      case 'sales-out':
        return 'expense';
      default:
        return 'expense';
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <TransactionTypeSelector 
          selectedType={selectedType} 
          onTypeChange={handleTypeChange} 
        />
        
        <AmountDateFields control={form.control} />

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

        <CategorySelector 
          control={form.control}
          name="category"
          availableCategories={availableCategories}
          selectedType={selectedType}
          addCategory={addCategory}
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
    </Form>
  );
}
