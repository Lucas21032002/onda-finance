import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
//import { useBalanceStore } from '@/store/useBalanceStore';
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ArrowLeftRight,
  LogOut,
  Waves,
  Plus,
  CreditCard,
  BarChart3,
  HelpCircle,
  Bell,
  Settings,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  //const resetBalance = useBalanceStore((s) => s.reset);

  const handleLogout = () => {
    logout();
    // resetBalance();
    navigate("/login");
  };

  const navItems = [
    { path: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { path: "/transfer", label: "Transferir", icon: ArrowLeftRight },
    { path: "#", label: "Cartões", icon: CreditCard },
    { path: "#", label: "Analytics", icon: BarChart3 },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden w-56 flex-col border-r border-border bg-sidebar lg:flex">
        <div className="flex h-16 items-center gap-2 px-6">
          <Waves className="h-6 w-6 text-primary" />
          <span className="font-display text-lg font-bold text-foreground">
            Onda
          </span>
        </div>

        <div className="px-4 pt-4">
          <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-widest text-primary">
            Private Banking
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => item.path !== "#" && navigate(item.path)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive(item.path)
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-2 p-3">
          <button className="flex w-full items-center gap-3 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            <HelpCircle className="h-4 w-4" />
            Suporte
          </button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent/50"
            onClick={() => navigate("/transfer")}
          >
            <Plus className="h-4 w-4" />
            Nova Transferência
          </Button>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent/50"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top header */}
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-card/90 px-6 backdrop-blur-md">
          <nav className="flex items-center gap-6">
            {navItems.slice(0, 3).map((item) => (
              <button
                key={item.label}
                onClick={() => item.path !== "#" && navigate(item.path)}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Input
                placeholder="Buscar transações..."
                className="h-9 w-56 border-border bg-muted/50 pl-8 text-sm"
              />
              <svg
                className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button className="text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
            </button>
            <button className="text-muted-foreground hover:text-foreground">
              <Settings className="h-5 w-5" />
            </button>
            <Avatar className="h-8 w-8 border border-primary/30">
              <AvatarFallback className="bg-primary/20 text-xs font-bold text-primary">
                {user?.name?.charAt(0).toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6 pb-24 lg:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-border bg-card/95 backdrop-blur-md lg:hidden">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => item.path !== "#" && navigate(item.path)}
            className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors ${
              isActive(item.path) ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
