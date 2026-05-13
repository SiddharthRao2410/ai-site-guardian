import { createFileRoute, Link } from "@tanstack/react-router";
import { scans } from "@/lib/mock-data";
import { StatusBadge } from "@/components/dashboard/badges";
import { ArrowUpRight, PlayCircle, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: OverviewPage,
});

function OverviewPage() {
  const stats = [
    { label: "Avg. Health Score", value: "92", delta: "+2.4%", icon: TrendingUp, tone: "text-success" },
    { label: "Active Scans", value: "3", delta: "running", icon: PlayCircle, tone: "text-primary" },
    { label: "Open Failures", value: "12", delta: "-3 this week", icon: AlertTriangle, tone: "text-destructive" },
    { label: "Tests Run (30d)", value: "8,412", delta: "+18%", icon: CheckCircle2, tone: "text-success" },
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Welcome back, Ada. Here's what your agents found.</p>
        <Link
          to="/dashboard/new-scan"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-sm font-semibold hover:brightness-110 transition-all"
        >
          <PlayCircle className="size-4" /> New Scan
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span>{s.label}</span>
              <s.icon className={`size-4 ${s.tone}`} />
            </div>
            <div className="mt-3 text-3xl font-display font-bold">{s.value}</div>
            <div className={`mt-1 text-[11px] font-mono ${s.tone}`}>{s.delta}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-display font-semibold">Recent Scans</h3>
            <Link to="/dashboard/reports" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
              View all <ArrowUpRight className="size-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {scans.slice(0, 5).map((s) => (
              <Link
                key={s.id}
                to="/dashboard/reports/$id"
                params={{ id: s.id }}
                className="flex items-center gap-4 p-4 hover:bg-accent/40 transition-colors"
              >
                <div className="relative size-10 rounded-full border-2 border-border grid place-items-center shrink-0">
                  <span className="text-[11px] font-mono font-bold">{s.score}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{s.name}</div>
                  <div className="text-[11px] font-mono text-muted-foreground truncate">{s.url} · {s.timestamp}</div>
                </div>
                <StatusBadge status={s.status} />
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-display font-semibold mb-4">Test Distribution</h3>
          <div className="space-y-4">
            {[
              { label: "Passed", value: 88, color: "bg-success" },
              { label: "Warnings", value: 9, color: "bg-warning" },
              { label: "Failed", value: 3, color: "bg-destructive" },
            ].map((d) => (
              <div key={d.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">{d.label}</span>
                  <span className="font-mono">{d.value}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-background overflow-hidden">
                  <div className={`h-full ${d.color}`} style={{ width: `${d.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-border space-y-3">
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Top Failing Page</p>
            <div className="font-mono text-sm text-destructive">/checkout</div>
            <p className="text-xs text-muted-foreground">Cart dispatch logic and mobile overflow detected in last 3 runs.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
