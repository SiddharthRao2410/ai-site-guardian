import { createFileRoute } from "@tanstack/react-router";
import { failures } from "@/lib/mock-data";
import { SeverityBadge } from "@/components/dashboard/badges";
import { Sparkles, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/dashboard/failures")({
  component: FailuresPage,
});

function FailuresPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{failures.length} unresolved failures across all scans.</p>
        <div className="flex gap-2 text-xs">
          <select className="bg-card border border-border rounded-md px-2 py-1.5 outline-none focus:border-primary/40">
            <option>All severities</option>
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {failures.map((f) => (
          <div key={f.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="space-y-2 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <SeverityBadge severity={f.severity} />
                  <span className="text-[11px] font-mono text-muted-foreground">{f.id}</span>
                  <span className="text-[11px] font-mono text-muted-foreground">· {f.page}</span>
                </div>
                <h4 className="font-display font-semibold">{f.title}</h4>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </div>
              <button className="border border-border px-3 py-1.5 rounded-md text-xs hover:bg-accent transition-colors flex items-center gap-1.5 shrink-0">
                <RotateCcw className="size-3" /> Retry
              </button>
            </div>
            <div className="rounded-md border border-primary/20 bg-primary/5 p-3">
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-primary font-bold mb-1">
                <Sparkles className="size-3" /> AI Suggested Fix
              </div>
              <p className="text-sm">{f.suggestedFix}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
