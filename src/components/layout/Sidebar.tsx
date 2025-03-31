
import { Link, useLocation } from "react-router-dom";
import { 
  BarChartIcon, 
  HomeIcon, 
  LogOutIcon,
  ArrowRightFromLineIcon,
  ArrowLeftFromLineIcon,
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PiggyBankIcon,
  SettingsIcon,
  XIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/auth";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
  onClick?: () => void;
}

const SidebarLink = ({ to, icon: Icon, label, collapsed, onClick }: SidebarLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link to={to} className="w-full" onClick={onClick}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 px-3 py-6 rounded-lg transition-all",
          isActive
            ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
      >
        <Icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "")} />
        {!collapsed && <span>{label}</span>}
      </Button>
    </Link>
  );
};

interface SidebarProps {
  isMobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export function Sidebar({ isMobileOpen, setMobileOpen }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuthStore();
  const isMobile = useIsMobile();
  
  const links = [
    { to: "/", label: "Dashboard", icon: HomeIcon },
    { to: "/expenses", label: "Expenses", icon: ArrowDownIcon },
    { to: "/sales", label: "Sales", icon: ArrowUpIcon },
    { to: "/deposits", label: "Deposits", icon: PiggyBankIcon },
    { to: "/reports", label: "Reports", icon: BarChartIcon },
    { to: "/settings", label: "Settings", icon: SettingsIcon },
  ];

  // Close mobile sidebar when route changes
  const location = useLocation();
  useEffect(() => {
    if (isMobile && setMobileOpen) {
      setMobileOpen(false);
    }
  }, [location.pathname, isMobile, setMobileOpen]);

  const sidebarClasses = cn(
    "h-screen bg-sidebar flex flex-col border-r border-sidebar-border transition-all duration-300 ease-in-out",
    collapsed && !isMobile ? "w-[70px]" : "w-[240px]",
    isMobile ? "fixed z-40" : "relative",
    isMobile && !isMobileOpen ? "-translate-x-full" : "translate-x-0"
  );

  return (
    <>
      {/* Overlay for mobile sidebar */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileOpen?.(false)}
        />
      )}
      
      <div className={sidebarClasses}>
        <div className="flex items-center justify-between p-4 mb-4">
          {!collapsed && (
            <h1 className="text-xl font-bold text-sidebar-foreground">
              FinanceTrack
            </h1>
          )}
          
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-sidebar-foreground"
              onClick={() => setMobileOpen?.(false)}
            >
              <XIcon className="h-5 w-5" />
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-1 px-2 overflow-y-auto">
          {links.map((link) => (
            <SidebarLink
              key={link.to}
              to={link.to}
              icon={link.icon}
              label={link.label}
              collapsed={collapsed}
              onClick={() => isMobile && setMobileOpen?.(false)}
            />
          ))}
        </div>

        <div className="mt-auto mb-8 px-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={() => logout()}
          >
            <LogOutIcon className={cn("h-5 w-5", collapsed ? "mx-auto" : "")} />
            {!collapsed && <span>Logout</span>}
          </Button>

          {!isMobile && (
            <Button
              variant="ghost"
              className="mt-2 w-full justify-center text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <ArrowRightFromLineIcon className="h-5 w-5" />
              ) : (
                <ArrowLeftFromLineIcon className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
