import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Globe, Monitor, Layers, CheckCircle2, Loader2 } from "lucide-react";

export const Route = createFileRoute("/dashboard/new-scan")({
  component: NewScanPage,
});

const STEPS = [
  "Crawling website",
  "Detecting pages",
  "Generating test cases",
  "Running browser tests",
  "AI analyzing failures",
  "Generating report",
];

function NewScanPage() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [browser, setBrowser] = useState("Chrome 122");
  const [device, setDevice] = useState("Desktop");
  const [depth, setDepth] = useState("Standard (up to 50 pages)");
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!running) return;
    if (step >= STEPS.length) {
      const t = setTimeout(() => navigate({ to: "/dashboard/reports/$id", params: { id: "QA-7729-XJ" } }), 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), 900);
    return () => clearTimeout(t);
  }, [running, step, navigate]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl tracking-tight">Configure your scan</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Point an autonomous agent at any URL and we'll handle the rest.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Globe className="size-3.5" /> Target URL
          </label>
          <div className="flex">
            <span className="px-3 py-2.5 rounded-l-lg border border-r-0 border-border bg-background text-sm font-mono text-muted-foreground">
              https://
            </span>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={running}
              placeholder="example.com"
              className="flex-1 bg-background border border-border rounded-r-lg px-3 py-2.5 text-sm font-mono outline-none focus:border-primary/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select label="Browser" icon={<Monitor className="size-3.5" />} value={browser} onChange={setBrowser} options={["Chrome 122", "Firefox 124", "Safari 17", "Edge 122"]} disabled={running} />
          <Select label="Device" icon={<Monitor className="size-3.5" />} value={device} onChange={setDevice} options={["Desktop", "Tablet", "Mobile"]} disabled={running} />
          <Select label="Scan Depth" icon={<Layers className="size-3.5" />} value={depth} onChange={setDepth} options={["Quick (10 pages)", "Standard (up to 50 pages)", "Deep (full crawl)"]} disabled={running} />
        </div>

        <button
          onClick={() => {
            if (!url) return;
            setRunning(true);
            setStep(0);
          }}
          disabled={running || !url}
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg text-sm font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {running ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Agent running...
            </>
          ) : (
            <>
              Start Scan <ArrowRight className="size-4" />
            </>
          )}
        </button>
      </div>

      {running && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-semibold">Pipeline</h3>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
              Step {Math.min(step + 1, STEPS.length)} / {STEPS.length}
            </span>
          </div>

          <div className="h-1 bg-background rounded-full overflow-hidden mb-6 relative">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${Math.min((step / STEPS.length) * 100, 100)}%` }}
            />
            <div className="absolute inset-0 animate-scan bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </div>

          <ul className="space-y-2.5">
            {STEPS.map((label, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <li key={label} className="flex items-center gap-3 text-sm">
                  {done ? (
                    <CheckCircle2 className="size-4 text-success" />
                  ) : active ? (
                    <Loader2 className="size-4 text-primary animate-spin" />
                  ) : (
                    <span className="size-4 rounded-full border border-border" />
                  )}
                  <span className={done ? "text-muted-foreground line-through" : active ? "text-foreground" : "text-muted-foreground/60"}>
                    {label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  icon,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  icon: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        {icon} {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary/50 disabled:opacity-60"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
