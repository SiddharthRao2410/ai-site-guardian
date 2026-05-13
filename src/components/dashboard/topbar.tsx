import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, Bell, ChevronDown, LogOut, User, Settings } from "lucide-react";

export function DashboardTopbar({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="h-14 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <h1 className="font-display font-semibold tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search reports, URLs..."
            className="w-64 bg-card border border-border rounded-md pl-8 pr-3 py-1.5 text-xs font-mono outline-none focus:border-primary/40"
          />
        </div>
        <button className="size-8 rounded-md border border-border bg-card grid place-items-center text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="size-4" />
        </button>
        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-accent transition-colors"
          >
            <span className="size-7 rounded-full bg-gradient-to-br from-primary to-cyan-400 grid place-items-center text-[11px] font-bold text-primary-foreground">
              AL
            </span>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-56 rounded-md border border-border bg-popover shadow-xl py-1.5 text-sm">
              <div className="px-3 py-2 border-b border-border">
                <div className="font-medium">Ada Lovelace</div>
                <div className="text-xs text-muted-foreground font-mono">ada@protoscan.ai</div>
              </div>
              <Link to="/dashboard/settings" className="flex items-center gap-2 px-3 py-2 hover:bg-accent">
                <User className="size-3.5" /> Profile
              </Link>
              <Link to="/dashboard/settings" className="flex items-center gap-2 px-3 py-2 hover:bg-accent">
                <Settings className="size-3.5" /> Settings
              </Link>
              <div className="my-1 border-t border-border" />
              <Link to="/login" className="flex items-center gap-2 px-3 py-2 hover:bg-accent text-destructive">
                <LogOut className="size-3.5" /> Log out
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
