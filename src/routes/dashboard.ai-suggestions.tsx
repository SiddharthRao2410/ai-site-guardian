import { createFileRoute } from "@tanstack/react-router";
import { aiSuggestions } from "@/lib/mock-data";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/dashboard/ai-suggestions")({
  component: AISuggestionsPage,
});

const impactTone: Record<string, string> = {
  High: "text-destructive border-destructive/20 bg-destructive/10",
  Medium: "text-warning border-warning/20 bg-warning/10",
  Low: "text-muted-foreground border-border bg-muted",
};

function AISuggestionsPage() {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 flex items-start gap-3">
        <Sparkles className="size-5 text-primary shrink-0 mt-0.5" />
        <div>
          <h3 className="font-display font-semibold">AI Summary</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Across your last 30 scans, performance and accessibility are your highest-leverage wins.
            Implementing the top 3 suggestions below is estimated to lift your average health score by{" "}
            <span className="text-primary font-semibold">+6 points</span>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {aiSuggestions.map((s) => (
          <div key={s.id} className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{s.category}</span>
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${impactTone[s.impact]}`}>
                {s.impact} Impact
              </span>
            </div>
            <h4 className="font-display font-semibold mb-2">{s.title}</h4>
            <p className="text-sm text-muted-foreground">{s.description}</p>
            <div className="mt-4 pt-4 border-t border-border flex gap-2">
              <button className="text-xs font-semibold text-primary hover:underline">Apply suggestion</button>
              <button className="text-xs text-muted-foreground hover:text-foreground">Dismiss</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
