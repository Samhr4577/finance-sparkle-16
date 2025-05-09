
import { useState } from "react";
import { CheckIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface CategorySelectorProps {
  control: any; // React Hook Form control
  name: string;
  availableCategories: string[];
  selectedType: string;
  addCategory: (type: string, category: string) => Promise<void>;
}

export function CategorySelector({
  control,
  name,
  availableCategories,
  selectedType,
  addCategory,
}: CategorySelectorProps) {
  const [open, setOpen] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  // Ensure availableCategories is always a non-empty array
  const categories = Array.isArray(availableCategories) && availableCategories.length > 0 
    ? availableCategories 
    : ['Other']; // Fallback to at least one category

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      try {
        await addCategory(selectedType, newCategory.trim());
        setNewCategory("");
        setIsAddingCategory(false);
      } catch (error) {
        console.error("Failed to add category:", error);
      }
    }
  };

  return (
    <>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Category</FormLabel>
            <div className="flex gap-2">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                      type="button" // Add type="button" to prevent form submission
                      onClick={(e) => {
                        e.preventDefault(); // Prevent any default form behavior
                        setOpen(true);
                      }}
                    >
                      {field.value && categories.includes(field.value)
                        ? field.value
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
                          onClick={() => {
                            setOpen(false);
                            setIsAddingCategory(true);
                          }}
                          type="button"
                        >
                          Add new category
                        </Button>
                      </div>
                    </CommandEmpty>
                    <CommandGroup heading={`${selectedType} categories`}>
                      {categories.map((category) => (
                        <CommandItem
                          key={category}
                          value={category}
                          onSelect={() => {
                            field.onChange(category);
                            setOpen(false);
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
                onClick={(e) => {
                  e.preventDefault();
                  setIsAddingCategory(true);
                }} 
                className="shrink-0"
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

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
            <Button variant="outline" onClick={() => setIsAddingCategory(false)} type="button">
              Cancel
            </Button>
            <Button onClick={handleAddCategory} type="button">
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
