
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAuthStore } from "@/lib/auth";

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
}

const SidebarLink = ({ to, icon: Icon, label, collapsed }: SidebarLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link to={to} className="w-full">
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

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuthStore();
  const links = [
    { to: "/", label: "Dashboard", icon: HomeIcon },
    { to: "/expenses", label: "Expenses", icon: ArrowDownIcon },
    { to: "/sales", label: "Sales", icon: ArrowUpIcon },
    { to: "/deposits", label: "Deposits", icon: PiggyBankIcon },
    { to: "/reports", label: "Reports", icon: BarChartIcon },
    { to: "/settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <div
      className={cn(
        "h-screen bg-sidebar flex flex-col border-r border-sidebar-border transition-all duration-300 ease-in-out",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="flex items-center p-4 mb-4">
        {!collapsed && (
          <h1 className="text-xl font-bold text-sidebar-foreground">
            FinanceTrack
          </h1>
        )}
      </div>

      <div className="flex flex-col gap-1 px-2">
        {links.map((link) => (
          <SidebarLink
            key={link.to}
            to={link.to}
            icon={link.icon}
            label={link.label}
            collapsed={collapsed}
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
      </div>
    </div>
  );
}
