
import * as z from "zod";

export const transactionSchema = z.object({
  amount: z.coerce.number().positive({ message: "Amount must be positive" }),
  description: z.string().min(1, { message: "Description is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  date: z.date(),
  notes: z.string().optional(),
  type: z.enum(["expense", "sales-in", "sales-out", "deposit"] as const),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;
