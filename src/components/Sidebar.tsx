import { 
  Home, 
  DollarSign, 
  CheckSquare, 
  Clock, 
  User, 
  Menu,
  GraduationCap,
  LogOut,
  BarChart3,
  Bell,
  Filter
} from "./icons";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "./ui/sheet";
import { useState } from "react";

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onLogout: () => void;
  isMobile?: boolean;
}

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "budget", label: "Smart Budget", icon: DollarSign },
  { id: "analytics", label: "Analytics", icon: Filter },
  { id: "reminders", label: "Bills & Reminders", icon: Bell },
  { id: "tasks", label: "Task Manager", icon: CheckSquare },
  { id: "punctuality", label: "Punctuality Log", icon: Clock },
  { id: "profile", label: "Profile Settings", icon: User },
];

function SidebarContent({ currentPage, onPageChange, onLogout }: Omit<SidebarProps, "isMobile">) {
  return (
    <div className="h-full flex flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-sidebar-primary" />
          <span className="text-lg text-sidebar-foreground">NextStep</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant={currentPage === item.id ? "secondary" : "ghost"}
            className={`w-full justify-start gap-3 ${
              currentPage === item.id 
                ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
            onClick={() => onPageChange(item.id)}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export function Sidebar({ currentPage, onPageChange, onLogout, isMobile = false }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isMobile) {
    return (
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72" aria-describedby={undefined}>
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Navigate through different sections of NextStep
          </SheetDescription>
          <SidebarContent 
            currentPage={currentPage} 
            onPageChange={(page) => {
              onPageChange(page);
              setMobileOpen(false);
            }} 
            onLogout={onLogout}
          />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="hidden md:block w-72 h-screen">
      <SidebarContent 
        currentPage={currentPage} 
        onPageChange={onPageChange} 
        onLogout={onLogout}
      />
    </div>
  );
}
