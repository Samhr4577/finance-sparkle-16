
import React, { useState } from "react";
import { useFinanceStore } from "@/store/financeStore";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Edit, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function CategoryManager() {
  const { categories, addCategory, updateCategory, deleteCategory } = useFinanceStore();
  
  const [selectedType, setSelectedType] = useState<string>("expense");
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleTypeSelect = (value: string) => {
    setSelectedType(value);
  };

  const handleAddCategory = () => {
    if (!categoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    
    addCategory(selectedType, categoryName);
    setCategoryName("");
    setIsAddDialogOpen(false);
  };

  const handleUpdateCategory = () => {
    if (!categoryName.trim() || !editingCategory) {
      toast.error("Please enter a category name");
      return;
    }
    
    updateCategory(selectedType, editingCategory, categoryName);
    setCategoryName("");
    setEditingCategory(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    if (window.confirm(`Are you sure you want to delete "${categoryToDelete}"?`)) {
      deleteCategory(selectedType, categoryToDelete);
    }
  };

  const openEditDialog = (category: string) => {
    setEditingCategory(category);
    setCategoryName(category);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Categories</h2>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new category for your transactions
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="type">Transaction Type</label>
                <Select 
                  value={selectedType}
                  onValueChange={handleTypeSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="sales-in">Income</SelectItem>
                      <SelectItem value="sales-out">Outgoing</SelectItem>
                      <SelectItem value="deposit">Deposit</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="name">Category Name</label>
                <Input
                  id="name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Enter category name"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCategory}>Add Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                Update the category name
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name">Category Name</label>
                <Input
                  id="edit-name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Enter new category name"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateCategory}>Update Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Filter by type:</p>
          <Select 
            value={selectedType}
            onValueChange={handleTypeSelect}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select transaction type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="sales-in">Income</SelectItem>
                <SelectItem value="sales-out">Outgoing</SelectItem>
                <SelectItem value="deposit">Deposit</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <div className="p-4">
            <h3 className="text-lg font-semibold capitalize">{selectedType} Categories</h3>
            <div className="mt-2 grid gap-2">
              {categories[selectedType]?.map((category) => (
                <div 
                  key={category} 
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <span>{category}</span>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => openEditDialog(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteCategory(category)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {(!categories[selectedType] || categories[selectedType].length === 0) && (
                <div className="text-center py-4 text-gray-500">
                  No categories found for this type. Add one to get started.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
