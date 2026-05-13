import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  PlayCircle,
  FileBarChart,
  AlertTriangle,
  Sparkles,
  CreditCard,
  Settings,
  LifeBuoy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const items: { label: string; to: string; icon: LucideIcon }[] = [
  { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
  { label: "New Scan", to: "/dashboard/new-scan", icon: PlayCircle },
  { label: "Reports", to: "/dashboard/reports", icon: FileBarChart },
  { label: "Failures", to: "/dashboard/failures", icon: AlertTriangle },
  { label: "AI Suggestions", to: "/dashboard/ai-suggestions", icon: Sparkles },
  { label: "Billing", to: "/dashboard/billing", icon: CreditCard },
  { label: "Settings", to: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground">
      <div className="h-14 px-5 flex items-center border-b border-border">
        <Link to="/" className="flex items-center gap-2 font-display font-bold tracking-tight text-sm">
          <span className="size-6 rounded-md bg-primary/15 border border-primary/30 grid place-items-center">
            <span className="size-2 rounded-sm bg-primary rotate-45" />
          </span>
          PROTOSCAN.AI
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="px-2 pt-3 pb-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          Workspace
        </p>
        {items.map((item) => {
          const active = item.to === "/dashboard" ? path === "/dashboard" : path.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm font-medium transition-colors ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
              }`}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border">
        <Link
          to="/docs"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground transition-colors"
        >
          <LifeBuoy className="size-4" />
          Help & Docs
        </Link>
      </div>
    </aside>
  );
}
