import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { scans, testCases, failures } from "@/lib/mock-data";
import { StatusBadge, SeverityBadge } from "@/components/dashboard/badges";
import { ArrowLeft, Download, RotateCcw, Sparkles, Image as ImageIcon } from "lucide-react";

export const Route = createFileRoute("/dashboard/reports/$id")({
  loader: ({ params }) => {
    const scan = scans.find((s) => s.id === params.id);
    if (!scan) throw notFound();
    return { scan };
  },
  component: ReportDetail,
  notFoundComponent: () => (
    <div className="p-12 text-center">
      <h2 className="text-lg font-semibold">Report not found</h2>
      <Link to="/dashboard/reports" className="text-primary hover:underline text-sm">Back to reports</Link>
    </div>
  ),
});

function ReportDetail() {
  const { scan } = Route.useLoaderData();

  const total = scan.passed + scan.failed + scan.warnings;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/dashboard/reports" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="size-3" /> Back to reports
          </Link>
          <h2 className="font-display font-bold text-2xl tracking-tight">{scan.name}</h2>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            {scan.id} · {scan.url} · {scan.timestamp}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="border border-border bg-card px-3 py-1.5 rounded-md text-xs font-medium hover:bg-accent transition-colors flex items-center gap-1.5">
            <Download className="size-3.5" /> Export PDF
          </button>
          <button className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-xs font-semibold hover:brightness-110 transition-all flex items-center gap-1.5">
            <RotateCcw className="size-3.5" /> Re-run
          </button>
        </div>
      </div>

      {/* Score grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ScoreCard label="Health" value={`${scan.score}`} suffix="/100" tone="text-primary" big />
        <ScoreCard label="Performance" value="91" suffix="/100" tone="text-success" />
        <ScoreCard label="Accessibility" value="84" suffix="/100" tone="text-warning" />
        <ScoreCard label="SEO" value="97" suffix="/100" tone="text-success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Test Cases */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-display font-semibold">Test Cases</h3>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{total} total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-background/40 border-b border-border text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="text-left px-4 py-2">Name</th>
                    <th className="text-left px-4 py-2">Status</th>
                    <th className="text-left px-4 py-2">Duration</th>
                    <th className="text-left px-4 py-2">Browser</th>
                    <th className="text-left px-4 py-2">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {testCases.map((t) => (
                    <tr key={t.id} className="hover:bg-accent/40">
                      <td className="px-4 py-2.5">{t.name}</td>
                      <td className="px-4 py-2.5"><StatusBadge status={t.status} /></td>
                      <td className="px-4 py-2.5 font-mono text-muted-foreground">{t.duration}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{t.browser}</td>
                      <td className="px-4 py-2.5 font-mono text-muted-foreground">{t.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Failures */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold">Failed Tests · AI Analysis</h3>
            {failures.slice(0, 3).map((f) => (
              <div key={f.id} className="rounded-xl border border-destructive/20 bg-card overflow-hidden">
                <div className="p-5 flex flex-col md:flex-row gap-5">
                  <div className="md:w-56 shrink-0">
                    <div className="aspect-[4/3] rounded-lg border border-border bg-background grid place-items-center text-muted-foreground/40">
                      <ImageIcon className="size-6" />
                    </div>
                    <p className="mt-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest text-center">Screenshot</p>
                  </div>
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <SeverityBadge severity={f.severity} />
                      <span className="text-[11px] font-mono text-muted-foreground">{f.page}</span>
                    </div>
                    <h4 className="text-base font-display font-semibold">{f.title}</h4>
                    <p className="text-sm text-muted-foreground">{f.description}</p>
                    <div className="font-mono text-[11px] bg-background border border-border rounded-md p-3 overflow-x-auto whitespace-pre">
                      <span className="text-destructive">{f.consoleLog}</span>
                    </div>
                    <div className="rounded-md border border-primary/20 bg-primary/5 p-3">
                      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-primary font-bold mb-1">
                        <Sparkles className="size-3" /> AI Suggested Fix
                      </div>
                      <p className="text-sm">{f.suggestedFix}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="border border-border px-3 py-1.5 rounded-md text-xs hover:bg-accent transition-colors flex items-center gap-1.5">
                        <RotateCcw className="size-3" /> Retry
                      </button>
                      <button className="border border-border px-3 py-1.5 rounded-md text-xs hover:bg-accent transition-colors">
                        Open in code
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h4 className="font-display font-semibold mb-4">Performance</h4>
            {[
              { label: "LCP", value: "1.8s", ok: true },
              { label: "CLS", value: "0.04", ok: true },
              { label: "INP", value: "240ms", ok: true },
              { label: "TTFB", value: "640ms", ok: false },
            ].map((m) => (
              <div key={m.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm text-muted-foreground">{m.label}</span>
                <span className={`font-mono text-sm ${m.ok ? "text-success" : "text-warning"}`}>{m.value}</span>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h4 className="font-display font-semibold mb-4">Broken Links</h4>
            <ul className="space-y-2 text-sm">
              {["/docs/getting-started/install", "/blog/2023/launch", "/api/v1/legacy"].map((l) => (
                <li key={l} className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs truncate">{l}</span>
                  <span className="text-[10px] font-mono text-destructive">404</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h4 className="font-display font-semibold mb-3">Flow Diagram</h4>
            <div className="text-xs font-mono space-y-1 text-muted-foreground">
              <div>/ → /products</div>
              <div className="pl-4">→ /products/$id</div>
              <div className="pl-8">→ /cart</div>
              <div className="pl-12 text-destructive">→ /checkout ✗</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreCard({
  label,
  value,
  suffix,
  tone,
  big,
}: {
  label: string;
  value: string;
  suffix?: string;
  tone: string;
  big?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{label}</div>
      <div className={`mt-2 font-display font-bold ${big ? "text-4xl" : "text-3xl"}`}>
        <span className={tone}>{value}</span>
        {suffix && <span className="text-muted-foreground/60 text-base font-normal">{suffix}</span>}
      </div>
    </div>
  );
}
