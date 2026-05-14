import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  ArrowRight, Globe, Monitor, Layers, Loader2, CheckCircle2,
  History, Clock, ChevronRight, AlertCircle, TrendingUp,
  Scan, Bot, Shield, Eye, Gauge, Bug, Wrench, Code2, Database, Zap
} from "lucide-react";
import { QaDashboard } from "@/components/dashboard/qa-dashboard";

export const Route = createFileRoute("/dashboard/new-scan")({
  component: NewScanPage,
});

const SCAN_STEPS = [
  { id: "crawl",    label: "Crawling website",       desc: "Discovering pages and site structure",     icon: Globe,   time: 15 },
  { id: "ai",       label: "AI website analysis",     desc: "Understanding flows and architecture",     icon: Bot,     time: 8 },
  { id: "links",    label: "Broken link testing",     desc: "Validating all internal and external links",icon: Zap,    time: 10 },
  { id: "buttons",  label: "Button interaction tests", desc: "Testing all interactive elements",          icon: Monitor, time: 12 },
  { id: "forms",    label: "Form validation tests",   desc: "Checking input validation and submission",  icon: Layers,  time: 10 },
  { id: "console",  label: "Console error analysis",  desc: "Intercepting JS errors and failed requests",icon: Bug,     time: 8 },
  { id: "a11y",     label: "Accessibility audit",     desc: "WCAG compliance and screen reader checks",  icon: Eye,     time: 6 },
  { id: "perf",     label: "Performance audit",       desc: "Load times, resource counts, DOM analysis", icon: Gauge,   time: 4 },
  { id: "login",    label: "Login flow testing",      desc: "Autonomous authentication testing",         icon: Shield,  time: 8 },
  { id: "bugs",     label: "AI bug report",           desc: "Deep analysis of all discovered issues",    icon: Bug,     time: 12 },
  { id: "fixes",    label: "AI fix suggestions",      desc: "Generating developer-grade code fixes",     icon: Wrench,  time: 15 },
  { id: "scripts",  label: "Playwright generation",   desc: "Creating automated test scripts",           icon: Code2,   time: 8 },
  { id: "save",     label: "Saving report",           desc: "Persisting results and regression data",    icon: Database, time: 2 },
];

/* ─── lightweight report summary type ─── */
interface ReportSummary {
  id?: string;
  url?: string;
  timestamp?: string;
  healthScore?: number;
  regressionResults?: any[];
  aiBugReport?: any;
}

function NewScanPage() {
  const [url, setUrl] = useState("");
  const [browser, setBrowser] = useState("Chrome 122");
  const [device, setDevice] = useState("Desktop");
  const [depth, setDepth] = useState("Standard (up to 50 pages)");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const logRef = useRef<HTMLDivElement>(null);
  const [scanResult, setScanResult] = useState<any>(null);

  /* ─── history state ─── */
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingReport, setLoadingReport] = useState(false);
  const [activeReportId, setActiveReportId] = useState<string | null>(null);

  /* ─── fetch report history on mount ─── */
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await fetch("http://localhost:8000/reports");
      if (res.ok) {
        const data = await res.json();
        setReports(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.log("Failed to fetch report history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  /* ─── load a historical report ─── */
  const loadReport = async (id: string) => {
    try {
      setLoadingReport(true);
      setActiveReportId(id);
      const res = await fetch(`http://localhost:8000/reports/${id}`);
      if (res.ok) {
        const data = await res.json();
        setScanResult(data);
      }
    } catch (err) {
      console.log("Failed to load report:", err);
    } finally {
      setLoadingReport(false);
    }
  };

  /* ─── new scan ─── */
  const handleScan = async () => {
    try {
      setLoading(true);
      setScanResult(null);
      setActiveReportId(null);
      setLoadingStep(0);
      setElapsed(0);
      setLogs([`[${new Date().toLocaleTimeString()}] Scan initiated`]);

      const timer = setInterval(() => setElapsed((p) => p + 1), 1000);
      const stepInterval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < SCAN_STEPS.length - 1) {
            const next = prev + 1;
            setLogs((l) => [...l, `[${new Date().toLocaleTimeString()}] ${SCAN_STEPS[next].label}...`]);
            return next;
          }
          return prev;
        });
      }, 4500);

      const fullUrl = url.startsWith("http") ? url : `https://${url}`;
      setLogs((l) => [...l, `[${new Date().toLocaleTimeString()}] Target: ${fullUrl}`]);

      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: fullUrl }),
      });
      clearInterval(stepInterval);
      clearInterval(timer);
      setLoadingStep(SCAN_STEPS.length);
      setLogs((l) => [...l, `[${new Date().toLocaleTimeString()}] ✓ Scan complete`]);

      const result = await response.json();
      setScanResult(result);
      fetchHistory();
    } catch (error) {
      console.log(error);
      setLogs((l) => [...l, `[${new Date().toLocaleTimeString()}] ✗ Scan failed`]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (ts?: string) => {
    if (!ts) return "Unknown";
    try {
      return new Date(ts).toLocaleString("en-US", {
        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
      });
    } catch { return ts; }
  };

  const getScoreColor = (score?: number) => {
    if (score == null) return "text-muted-foreground";
    if (score >= 80) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="flex gap-6 min-h-[calc(100vh-80px)]">

      {/* ═══════════ HISTORY SIDEBAR ═══════════ */}
      <aside className="w-72 shrink-0 space-y-3 hidden lg:block">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <History className="size-3.5" /> Previous Reports
          </h3>
          <span className="text-[10px] font-mono text-muted-foreground">
            {reports.length} scan{reports.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="space-y-2 max-h-[calc(100vh-160px)] overflow-y-auto pr-1">
          {loadingHistory && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground p-4 justify-center">
              <Loader2 className="size-4 animate-spin" /> Loading reports...
            </div>
          )}

          {!loadingHistory && reports.length === 0 && (
            <div className="text-center p-6 text-sm text-muted-foreground border border-dashed border-border rounded-lg">
              <AlertCircle className="size-5 mx-auto mb-2 opacity-40" />
              No scans yet. Run your first scan!
            </div>
          )}

          {reports.map((r) => {
            const isActive = activeReportId === r?.id;
            return (
              <button
                key={r?.id || Math.random()}
                onClick={() => r?.id && loadReport(r.id)}
                disabled={loadingReport}
                className={`w-full text-left p-3 rounded-lg border transition-all hover:border-primary/40 hover:bg-primary/5 disabled:opacity-60 ${
                  isActive
                    ? "border-primary/50 bg-primary/10 shadow-sm"
                    : "border-border bg-card/50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-mono text-foreground truncate" title={r?.url || ""}>
                      {r?.url?.replace(/^https?:\/\//, "")?.slice(0, 28) || "Unknown URL"}
                    </p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="size-3" />{formatDate(r?.timestamp)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-sm font-bold ${getScoreColor(r?.healthScore)}`}>
                      {r?.healthScore ?? "—"}
                    </span>
                    <p className="text-[9px] text-muted-foreground uppercase">Score</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    {(r?.regressionResults?.length ?? 0) > 0 && (
                      <span className="flex items-center gap-0.5 text-yellow-500">
                        <TrendingUp className="size-3" />{r?.regressionResults?.length} reg
                      </span>
                    )}
                    {(r?.aiBugReport?.criticalIssues?.length ?? 0) > 0 && (
                      <span className="flex items-center gap-0.5 text-red-500">
                        <AlertCircle className="size-3" />{r?.aiBugReport?.criticalIssues?.length} crit
                      </span>
                    )}
                    {!(r?.regressionResults?.length) && !(r?.aiBugReport?.criticalIssues?.length) && (
                      <span className="text-green-500">✓ Clean</span>
                    )}
                  </div>
                  <ChevronRight className="size-3 text-muted-foreground" />
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <div className="flex-1 min-w-0 space-y-6">
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
                disabled={loading}
                placeholder="example.com"
                className="flex-1 bg-background border border-border rounded-r-lg px-3 py-2.5 text-sm font-mono outline-none focus:border-primary/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select label="Browser" icon={<Monitor className="size-3.5" />} value={browser} onChange={setBrowser} options={["Chrome 122", "Firefox 124", "Safari 17", "Edge 122"]} disabled={loading} />
            <Select label="Device" icon={<Monitor className="size-3.5" />} value={device} onChange={setDevice} options={["Desktop", "Tablet", "Mobile"]} disabled={loading} />
            <Select label="Scan Depth" icon={<Layers className="size-3.5" />} value={depth} onChange={setDepth} options={["Quick (10 pages)", "Standard (up to 50 pages)", "Deep (full crawl)"]} disabled={loading} />
          </div>

          <button
            onClick={handleScan}
            disabled={loading || !url}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg text-sm font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 className="size-4 animate-spin" /> Agent running...</>
            ) : (
              <>Start Scan <ArrowRight className="size-4" /></>
            )}
          </button>
        </div>

        {/* ═══ AI ORCHESTRATION PANEL ═══ */}
        {loading && (
          <div className="rounded-xl border border-primary/20 bg-card overflow-hidden shadow-lg shadow-primary/5">
            {/* Header bar */}
            <div className="px-6 py-4 border-b border-border/50 bg-primary/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Scan className="size-5 text-primary" />
                    <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-primary animate-ping" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">AI QA Agent Active</h3>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      Autonomous scan in progress • {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, "0")} elapsed
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-primary font-mono">
                    {Math.min(Math.round(((loadingStep + 1) / SCAN_STEPS.length) * 100), 100)}%
                  </span>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Complete</p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-3 h-1.5 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary via-primary to-green-500 transition-all duration-700 ease-out"
                  style={{ width: `${Math.min(((loadingStep + 1) / SCAN_STEPS.length) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Steps grid */}
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {SCAN_STEPS.map((step, i) => {
                const done = i < loadingStep;
                const active = i === loadingStep;
                const pending = i > loadingStep;
                const StepIcon = step.icon;
                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-500 ${
                      active
                        ? "bg-primary/10 border border-primary/30 shadow-sm shadow-primary/10"
                        : done
                        ? "bg-green-500/5 border border-transparent"
                        : "border border-transparent opacity-40"
                    }`}
                  >
                    {/* Icon */}
                    <div className={`shrink-0 size-7 rounded-md flex items-center justify-center ${
                      active
                        ? "bg-primary/20"
                        : done
                        ? "bg-green-500/10"
                        : "bg-muted/30"
                    }`}>
                      {done ? (
                        <CheckCircle2 className="size-4 text-green-500" />
                      ) : active ? (
                        <Loader2 className="size-4 text-primary animate-spin" />
                      ) : (
                        <StepIcon className="size-3.5 text-muted-foreground" />
                      )}
                    </div>

                    {/* Label */}
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold leading-tight ${
                        active ? "text-primary" : done ? "text-green-500/80" : "text-muted-foreground"
                      }`}>
                        {step.label}
                      </p>
                      {(active || done) && (
                        <p className="text-[10px] text-muted-foreground truncate">{step.desc}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live log */}
            <div className="border-t border-border/50">
              <div className="px-4 py-2 flex items-center gap-2 border-b border-border/30">
                <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Live Agent Log</span>
              </div>
              <div ref={logRef} className="px-4 py-3 max-h-28 overflow-y-auto bg-[#0a0a0b] font-mono text-[11px] space-y-0.5">
                {logs.map((log, i) => (
                  <p key={i} className={`${
                    log.includes("✓") ? "text-green-400"
                    : log.includes("✗") ? "text-red-400"
                    : i === logs.length - 1 ? "text-primary"
                    : "text-muted-foreground/70"
                  }`}>{log}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading historical report */}
        {loadingReport && (
          <div className="rounded-xl border border-border bg-card p-8 flex items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="size-5 animate-spin text-primary" />
            <span className="text-sm">Loading report...</span>
          </div>
        )}

        {/* Results dashboard */}
        {scanResult && !loadingReport && <QaDashboard scanResult={scanResult} />}
      </div>
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