
import { useAuthStore } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  PlusIcon, 
  BellIcon,
  MenuIcon 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/components/ui/use-toast";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { playSoundEffect } from "@/lib/audio";

interface HeaderProps {
  toggleMobileSidebar: () => void;
}

export function Header({ toggleMobileSidebar }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleProfileClick = () => {
    toast({
      title: "Your Profile",
      description: `Logged in as ${user?.name} (${user?.email})`,
    });
  };

  const handleNotificationClick = () => {
    playSoundEffect("notification");
    toast({
      title: "Notifications",
      description: "You have no new notifications",
    });
  };

  return (
    <header className="border-b border-border h-16 flex items-center justify-between px-4 md:px-6 bg-background">
      <div className="flex items-center gap-4">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleMobileSidebar}>
            <MenuIcon className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-lg font-medium md:hidden">FinanceTrack</h1>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        <Link to="/add-transaction">
          <Button size="sm" className="text-xs md:text-sm">
            <PlusIcon className="h-4 w-4 mr-1" />
            <span className="hidden xs:inline">Add Transaction</span>
          </Button>
        </Link>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          onClick={handleNotificationClick}
        >
          <BellIcon className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full"></span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 h-8" onClick={handleProfileClick}>
              <div className="flex items-center gap-3">
                <div className="text-sm hidden md:block text-right">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-muted-foreground text-xs">{user?.email}</p>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{initials}</AvatarFallback>
                  <AvatarImage src="/placeholder.svg" />
                </Avatar>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfileClick}>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
