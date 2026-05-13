import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";

export const Route = createFileRoute("/dashboard/billing")({
  component: BillingPage,
});

function BillingPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="rounded-xl border border-border bg-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest">Current plan</p>
          <h2 className="font-display font-bold text-2xl mt-1">Pro</h2>
          <p className="text-sm text-muted-foreground mt-1">Renews on November 14, 2026 · $49/month</p>
        </div>
        <div className="flex gap-2">
          <button className="border border-border px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors">Manage payment</button>
          <button className="bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-semibold hover:brightness-110 transition-all">
            Upgrade to Enterprise
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Scans this cycle", value: "1,284", limit: "/ 2,000" },
          { label: "Projects", value: "12", limit: "unlimited" },
          { label: "Retention", value: "30 days", limit: "" },
        ].map((m) => (
          <div key={m.label} className="rounded-xl border border-border bg-card p-4">
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{m.label}</div>
            <div className="mt-2 text-2xl font-display font-bold">
              {m.value} <span className="text-sm text-muted-foreground font-normal">{m.limit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex justify-between items-center">
          <h3 className="font-display font-semibold">Invoices</h3>
          <button className="text-xs text-primary hover:underline">Download all</button>
        </div>
        <table className="w-full text-sm">
          <thead className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground border-b border-border">
            <tr>
              <th className="text-left px-5 py-2">Date</th>
              <th className="text-left px-5 py-2">Amount</th>
              <th className="text-left px-5 py-2">Status</th>
              <th className="text-left px-5 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[
              { d: "Oct 14, 2026", a: "$49.00" },
              { d: "Sep 14, 2026", a: "$49.00" },
              { d: "Aug 14, 2026", a: "$49.00" },
            ].map((i) => (
              <tr key={i.d}>
                <td className="px-5 py-3">{i.d}</td>
                <td className="px-5 py-3 font-mono">{i.a}</td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-1 text-success text-xs"><Check className="size-3" /> Paid</span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button className="text-xs text-primary hover:underline">PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
