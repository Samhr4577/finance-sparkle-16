
import { useAuthStore } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PlusIcon, BellIcon } from "lucide-react";
import { Link } from "react-router-dom";

export function Header() {
  const { user } = useAuthStore();

  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <header className="border-b border-border h-16 flex items-center justify-between px-6 bg-background">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-medium md:hidden">FinanceTrack</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <Link to="/add-transaction">
          <Button size="sm">
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Transaction
          </Button>
        </Link>
        
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full"></span>
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="text-sm hidden md:block">
            <p className="font-medium">{user?.name}</p>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarFallback>{initials}</AvatarFallback>
            <AvatarImage src="/placeholder.svg" />
          </Avatar>
        </div>
      </div>
    </header>
  );
}
