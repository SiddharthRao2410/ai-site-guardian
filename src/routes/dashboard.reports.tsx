import { createFileRoute, Link } from "@tanstack/react-router";
import { scans } from "@/lib/mock-data";
import { StatusBadge } from "@/components/dashboard/badges";
import { Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const [q, setQ] = useState("");
  const filtered = scans.filter(
    (s) => s.name.toLowerCase().includes(q.toLowerCase()) || s.url.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter by name or URL..."
            className="w-full bg-card border border-border rounded-md pl-8 pr-3 py-2 text-sm font-mono outline-none focus:border-primary/40"
          />
        </div>
        <Link to="/dashboard/new-scan" className="bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-semibold hover:brightness-110 transition-all">
          + New Scan
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background/40 border-b border-border text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">Report</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Score</th>
                <th className="text-left px-4 py-3">Duration</th>
                <th className="text-left px-4 py-3">Browser</th>
                <th className="text-left px-4 py-3">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-accent/40 transition-colors">
                  <td className="px-4 py-3">
                    <Link to="/dashboard/reports/$id" params={{ id: s.id }} className="block">
                      <div className="font-medium">{s.name}</div>
                      <div className="text-[11px] font-mono text-muted-foreground">{s.url}</div>
                    </Link>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                  <td className="px-4 py-3 font-mono">{s.score}</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">{s.duration}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.browser}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-sm text-muted-foreground">No scans match your filter.</div>
        )}
      </div>
    </div>
  );
}
