import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState as useStateReact, useRef as useRefReact } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Activity, Layers, FileText, ListChecks, CheckCircle2, AlertTriangle,
  Lightbulb, Link2, MousePointerClick, FormInput, Terminal, Eye,
  Gauge, Bug, XCircle, Shield, Code2, TrendingDown, MonitorCheck,
  ChevronDown, ChevronRight, Copy, Check, Clock, Wrench, Download, Loader2
} from "lucide-react";

/* ─── BULLETPROOF safe string extractor ─── */
function safeStr(item: any): string {
  if (item == null) return "No data";
  if (typeof item === "string") return item;
  if (typeof item === "number" || typeof item === "boolean") return String(item);
  if (typeof item === "object") {
    const tryFields = ["description", "name", "message", "text", "title", "summary", "reason", "url"];
    for (const f of tryFields) {
      if (item[f] != null && typeof item[f] === "string") return item[f];
    }
    try { return JSON.stringify(item); } catch { return "Data available"; }
  }
  return String(item);
}

/* ─── Safe JSX renderer for issue-like objects ─── */
function SafeIssue({ item, color = "muted-foreground" }: { item: any; color?: string }) {
  if (typeof item === "string") {
    return <span>{item}</span>;
  }
  if (item && typeof item === "object") {
    return (
      <div className="space-y-1">
        {item.severity && <span className={`font-bold uppercase text-xs text-${color}`}>{String(item.severity)}</span>}
        {item.title && <p className="font-semibold text-sm">{String(item.title)}</p>}
        {item.description && <p className="text-sm">{String(item.description)}</p>}
        {item.page && <p className="text-xs text-muted-foreground">{String(item.page)}</p>}
        {item.testResult && <p className="text-xs text-muted-foreground">Result: {String(item.testResult)}</p>}
        {item.pagesAffected && <p className="text-xs text-muted-foreground">Pages: {Array.isArray(item.pagesAffected) ? item.pagesAffected.join(", ") : String(item.pagesAffected)}</p>}
        {!item.description && !item.title && !item.severity && <span className="text-sm">{safeStr(item)}</span>}
      </div>
    );
  }
  return <span>{String(item ?? "No data")}</span>;
}

/* ─── helpers ─── */
function countFailed(arr: any[] | undefined, key = "status") {
  return (arr || []).filter((i: any) => i[key] === "failed").length;
}
function countPassed(arr: any[] | undefined, key = "status") {
  return (arr || []).filter((i: any) => i[key] === "passed").length;
}

function calcHealthScore(s: any): number {
  if (!s) return 0;
  let score = 100;
  score -= countFailed(s?.brokenLinkResults) * 5;
  score -= countFailed(s?.buttonTestResults) * 3;
  score -= countFailed(s?.loginTestResults?.results) * 8;
  (s?.consoleTestResults || []).forEach((p: any) => {
    score -= (p?.consoleErrors?.length || 0) * 2;
    score -= (p?.failedRequests?.length || 0) * 3;
  });
  (s?.accessibilityResults || []).forEach((p: any) => {
    if (!p?.accessibilityPassed) score -= 4;
  });
  (s?.performanceResults || []).forEach((p: any) => {
    if (p?.performanceRating === "poor") score -= 6;
    else if (p?.performanceRating === "average") score -= 3;
  });
  return Math.max(0, Math.min(100, score));
}

/* ─── Circular Score ─── */
function HealthCircle({ score }: { score: number }) {
  const r = 54, c = 2 * Math.PI * r;
  const color = score >= 80 ? "text-success" : score >= 50 ? "text-warning" : "text-destructive";
  return (
    <div className="relative size-36 mx-auto">
      <svg viewBox="0 0 120 120" className="size-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" strokeWidth="8" className="stroke-border" />
        <circle cx="60" cy="60" r={r} fill="none" strokeWidth="8"
          strokeDasharray={c} strokeDashoffset={c - (score / 100) * c}
          strokeLinecap="round" className={`${color} stroke-current transition-all duration-1000`} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold ${color}`}>{score}</span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Health</span>
      </div>
    </div>
  );
}

/* ─── Section wrapper ─── */
function Section({ icon, title, children, className = "" }: { icon: React.ReactNode; title: string; children: React.ReactNode; className?: string }) {
  return (
    <Card className={className}>
      <CardHeader><CardTitle className="text-lg flex items-center gap-2">{icon}{title}</CardTitle></CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

/* ─── Stat card ─── */
function Stat({ label, value, color = "text-foreground" }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="rounded-lg border border-border bg-background/50 p-4 text-center">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-[11px] text-muted-foreground uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}

/* ═══════════════════ MAIN ═══════════════════ */
export function QaDashboard({ scanResult }: { scanResult: any }) {
  const s = scanResult;
  const health = calcHealthScore(s);
  const totalPages = s?.data?.totalPages || 0;
  const totalPassed = countPassed(s?.brokenLinkResults) + countPassed(s?.buttonTestResults) + countPassed(s?.loginTestResults?.results);
  const totalFailed = countFailed(s?.brokenLinkResults) + countFailed(s?.buttonTestResults) + countFailed(s?.loginTestResults?.results);
  const dashRef = useRefReact<HTMLDivElement>(null);
  const [exporting, setExporting] = useStateReact(false);

  const handleExportPdf = async () => {
    if (!dashRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(dashRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#0a0a0b",
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgW = pageW - 20;
      const imgH = (canvas.height * imgW) / canvas.width;
      let y = 10;
      let remaining = imgH;
      const sliceH = pageH - 20;

      while (remaining > 0) {
        if (y !== 10) pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, y - (imgH - remaining), imgW, imgH);
        remaining -= sliceH;
        y = 10;
      }

      const urlSlug = (s?.data?.pages?.[0]?.url || s?.url || "report")
        .replace(/^https?:\/\//, "").replace(/[^a-zA-Z0-9]/g, "-").slice(0, 30);
      const date = new Date().toISOString().slice(0, 10);
      pdf.save(`qa-report-${urlSlug}-${date}.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div ref={dashRef} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* ── HEADER + EXPORT ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">QA Report</h1>
          {(s?.url || s?.data?.pages?.[0]?.url) && (
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              {safeStr(s?.url || s?.data?.pages?.[0]?.url)}
              {s?.timestamp && <> · {new Date(s.timestamp).toLocaleString()}</>}
              {s?.id && <> · ID: {s.id}</>}
            </p>
          )}
        </div>
        <button
          onClick={handleExportPdf}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-accent text-sm font-medium transition-colors disabled:opacity-50"
        >
          {exporting ? (
            <><Loader2 className="size-4 animate-spin" /> Generating PDF...</>
          ) : (
            <><Download className="size-4" /> Export PDF</>
          )}
        </button>
      </div>

      {/* ── TOP SUMMARY ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Pages Crawled" value={totalPages} color="text-primary" />
        <Stat label="QA Health" value={`${health}%`} color={health >= 80 ? "text-success" : health >= 50 ? "text-warning" : "text-destructive"} />
        <Stat label="Passed" value={totalPassed} color="text-success" />
        <Stat label="Failed" value={totalFailed} color="text-destructive" />
      </div>

      {/* ── HEALTH CIRCLE + WEBSITE TYPE ── */}
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1 bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Shield className="size-4 text-primary" /> QA Health Score
            </CardTitle>
          </CardHeader>
          <CardContent><HealthCircle score={health} /></CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Activity className="size-4 text-primary" /> Website Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-4">{s.aiAnalysis?.websiteType || "Unknown"}</div>
            <div className="flex flex-wrap gap-2">
              {(s?.aiAnalysis?.detectedFlows || []).map((f: any, i: number) => (
                <Badge key={i} variant="secondary" className="bg-secondary/50">{safeStr(f)}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── AI ANALYSIS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section icon={<FileText className="size-5 text-primary" />} title="Important Pages">
          {(s.aiAnalysis?.importantPages || []).map((p: any, i: number) => (
            <div key={i} className="flex justify-between items-center border-b border-border py-2 last:border-0">
              <span className="text-sm font-mono text-muted-foreground truncate mr-4 max-w-[220px]" title={safeStr(p?.url)}>{safeStr(p?.url)}</span>
              <Badge variant="outline" className="shrink-0">{safeStr(p?.type)}</Badge>
            </div>
          ))}
          {!(s.aiAnalysis?.importantPages?.length) && <span className="text-sm text-muted-foreground">None detected.</span>}
        </Section>

        <Section icon={<ListChecks className="size-5 text-success" />} title="AI Test Cases">
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {(s.aiAnalysis?.testCases || []).map((tc: any, i: number) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="size-4 text-success mt-0.5 shrink-0" />
                <span className="text-sm leading-snug">{safeStr(tc)}</span>
              </div>
            ))}
          </div>
          {!(s.aiAnalysis?.testCases?.length) && <span className="text-sm text-muted-foreground">None generated.</span>}
        </Section>

        <Section icon={<AlertTriangle className="size-5 text-destructive" />} title="Detected Risks" className="border-destructive/30 bg-destructive/5">
          <div className="space-y-2">
            {(s.aiAnalysis?.risks || []).map((r: any, i: number) => (
              <div key={i} className="flex items-start gap-3">
                <div className="size-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                <span className="text-sm text-destructive leading-snug">{safeStr(r)}</span>
              </div>
            ))}
          </div>
          {!(s.aiAnalysis?.risks?.length) && <span className="text-sm text-muted-foreground">No risks.</span>}
        </Section>

        <Section icon={<Lightbulb className="size-5 text-primary" />} title="Recommendations" className="border-primary/20 bg-primary/5">
          <div className="space-y-2">
            {(s.aiAnalysis?.recommendations || []).map((r: any, i: number) => (
              <div key={i} className="flex items-start gap-3">
                <div className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span className="text-sm leading-snug">{safeStr(r)}</span>
              </div>
            ))}
          </div>
          {!(s.aiAnalysis?.recommendations?.length) && <span className="text-sm text-muted-foreground">None.</span>}
        </Section>
      </div>

      {/* ── LOGIN TESTS ── */}
      {s?.loginTestResults && (
        <Section icon={<Shield className="size-5 text-primary" />} title="Autonomous Login Testing">
          {(s?.loginTestResults?.results || []).map((t: any, i: number) => (
            <div key={i} className="flex items-center justify-between border-b border-border py-3 last:border-0">
              <span className="text-sm">{t?.test}</span>
              <Badge variant={t?.status === "passed" ? "secondary" : "destructive"} className={t?.status === "passed" ? "bg-success/15 text-success border-success/30" : ""}>
                {t?.status}
              </Badge>
            </div>
          ))}
          {(s?.loginTestResults?.consoleErrors?.length > 0) && (
            <div className="mt-4 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
              <h4 className="text-xs uppercase tracking-wider text-destructive font-bold mb-2">Console Errors</h4>
              {(s?.loginTestResults?.consoleErrors || []).map((e: string, i: number) => (
                <div key={i} className="text-sm text-destructive">{e}</div>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* ── BROKEN LINKS ── */}
      {s.brokenLinkResults?.length > 0 && (
        <Section icon={<Link2 className="size-5 text-primary" />} title="Broken Link Testing">
          <div className="space-y-1">
            {s.brokenLinkResults.map((l: any, i: number) => (
              <div key={i} className={`flex items-center justify-between py-2 px-3 rounded-lg text-sm ${l.status === "failed" ? "bg-destructive/5" : ""}`}>
                <span className="font-mono text-muted-foreground truncate mr-4 max-w-[280px]" title={l.url}>{l.url}</span>
                <div className="flex items-center gap-3 shrink-0">
                  {l.httpStatus && <span className="text-xs text-muted-foreground">{l.httpStatus}</span>}
                  <Badge variant={l.status === "passed" ? "secondary" : "destructive"} className={l.status === "passed" ? "bg-success/15 text-success border-success/30" : ""}>
                    {l.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── BUTTON TESTS ── */}
      {s.buttonTestResults?.length > 0 && (
        <Section icon={<MousePointerClick className="size-5 text-primary" />} title="Button Interaction Testing">
          <div className="space-y-1">
            {s.buttonTestResults.map((b: any, i: number) => (
              <div key={i} className={`flex items-center justify-between py-2 px-3 rounded-lg text-sm ${b.status === "failed" ? "bg-destructive/5" : ""}`}>
                <div className="truncate mr-4">
                  <span className="text-muted-foreground font-mono text-xs">{b.page?.split("/").pop() || b.page}</span>
                  <span className="mx-2 text-border">→</span>
                  <span className="font-medium">{b.button || "Unknown"}</span>
                </div>
                <Badge variant={b.status === "passed" ? "secondary" : "destructive"} className={b.status === "passed" ? "bg-success/15 text-success border-success/30" : ""}>
                  {b.status}
                </Badge>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── FORM TESTS ── */}
      {s.formTestResults?.length > 0 && (
        <Section icon={<FormInput className="size-5 text-primary" />} title="Form Validation Testing">
          <div className="space-y-1">
            {s.formTestResults.map((f: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg text-sm">
                <div>
                  <span className="text-muted-foreground font-mono text-xs">{f.page?.split("/").pop() || f.page}</span>
                  {f.formNumber && <span className="ml-2 text-xs text-muted-foreground">Form #{f.formNumber}</span>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {f.validationDetected !== undefined && (
                    <span className={`text-xs ${f.validationDetected ? "text-success" : "text-warning"}`}>
                      {f.validationDetected ? "Validation ✓" : "No validation"}
                    </span>
                  )}
                  <Badge variant={f.status === "failed" ? "destructive" : "secondary"} className={f.status !== "failed" ? "bg-success/15 text-success border-success/30" : ""}>
                    {f.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── CONSOLE ERRORS ── */}
      {s.consoleTestResults?.length > 0 && (
        <Section icon={<Terminal className="size-5 text-warning" />} title="Console Error Intelligence" className="border-warning/20">
          <div className="space-y-4">
            {s.consoleTestResults.map((p: any, i: number) => (
              <div key={i}>
                <p className="text-xs font-mono text-muted-foreground mb-1">{p.page}</p>
                {(p.consoleErrors?.length > 0 || p.failedRequests?.length > 0) ? (
                  <div className="space-y-1 pl-3 border-l-2 border-warning/30">
                    {(p.consoleErrors || []).map((e: any, j: number) => (
                      <div key={`e${j}`} className="text-sm text-destructive flex items-start gap-2">
                        <XCircle className="size-3.5 mt-0.5 shrink-0" />{typeof e === "string" ? e : e.message}
                      </div>
                    ))}
                    {(p.failedRequests || []).map((r: any, j: number) => (
                      <div key={`r${j}`} className="text-sm text-warning flex items-start gap-2">
                        <AlertTriangle className="size-3.5 mt-0.5 shrink-0" />{r.url} — {r.failure}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-success">No errors</span>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── ACCESSIBILITY ── */}
      {s.accessibilityResults?.length > 0 && (
        <Section icon={<Eye className="size-5 text-primary" />} title="Accessibility Audit">
          <div className="space-y-3">
            {s.accessibilityResults.map((a: any, i: number) => (
              <div key={i} className={`p-3 rounded-lg border ${a.accessibilityPassed ? "border-success/20 bg-success/5" : "border-warning/20 bg-warning/5"}`}>
                <p className="text-xs font-mono text-muted-foreground mb-2">{a.page}</p>
                <div className="flex flex-wrap gap-3 text-sm">
                  <span>🖼 Missing Alt: <strong className={a.imagesWithoutAlt ? "text-destructive" : "text-success"}>{a.imagesWithoutAlt ?? "?"}</strong></span>
                  <span>🏷 Unlabeled Inputs: <strong className={a.unlabeledInputs ? "text-destructive" : "text-success"}>{a.unlabeledInputs ?? "?"}</strong></span>
                  <span>🔘 Empty Buttons: <strong className={a.emptyButtons ? "text-destructive" : "text-success"}>{a.emptyButtons ?? "?"}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── PERFORMANCE ── */}
      {s.performanceResults?.length > 0 && (
        <Section icon={<Gauge className="size-5 text-primary" />} title="Performance Audit">
          <div className="space-y-3">
            {s.performanceResults.map((p: any, i: number) => {
              const ratingColor = p.performanceRating === "good" ? "text-success" : p.performanceRating === "average" ? "text-warning" : "text-destructive";
              const barPct = Math.min(100, Math.max(5, 100 - (p.loadTime || 0) / 80));
              return (
                <div key={i} className="p-3 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-muted-foreground truncate max-w-[250px]">{p.page}</span>
                    <Badge variant="outline" className={ratingColor}>{p.performanceRating}</Badge>
                  </div>
                  <div className="h-1.5 bg-background rounded-full overflow-hidden mb-2">
                    <div className={`h-full rounded-full transition-all duration-700 ${p.performanceRating === "good" ? "bg-success" : p.performanceRating === "average" ? "bg-warning" : "bg-destructive"}`} style={{ width: `${barPct}%` }} />
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>⏱ {p.loadTime}ms</span>
                    <span>📦 {p.resourceCount} resources</span>
                    <span>🧱 {p.domSize} DOM nodes</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* ── AI BUG REPORT ── */}
      {s?.aiBugReport && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2"><Bug className="size-5 text-destructive" /> AI Bug Report</h2>

          {s?.aiBugReport?.summary && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6"><p className="text-sm leading-relaxed">{safeStr(s?.aiBugReport?.summary)}</p></CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Critical", items: s?.aiBugReport?.criticalIssues, color: "destructive" },
              { title: "Medium", items: s?.aiBugReport?.mediumIssues, color: "warning" },
              { title: "Low", items: s?.aiBugReport?.lowIssues, color: "muted-foreground" },
            ].map(({ title, items, color }) => (
              <Card key={title} className={color === "destructive" ? "border-destructive/30 bg-destructive/5" : ""}>
                <CardHeader className="pb-2">
                  <CardTitle className={`text-sm font-bold text-${color}`}>{title} Issues ({(items || []).length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-48 overflow-y-auto">
                  {(items || []).map((issue: any, i: number) => (
                    <div key={i} className="border border-border rounded-lg p-3">
                      <SafeIssue item={issue} color={color} />
                    </div>
                  ))}
                  {!(items?.length) && <span className="text-xs text-muted-foreground">None</span>}
                </CardContent>
              </Card>
            ))}
          </div>

          {(s?.aiBugReport?.recommendations?.length > 0) && (
            <Section icon={<Lightbulb className="size-5 text-primary" />} title="Bug Report Recommendations" className="border-primary/20 bg-primary/5">
              <div className="space-y-2">
                {(s?.aiBugReport?.recommendations || []).map((r: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <div className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>{safeStr(r)}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>
      )}

      {/* ══════ AI FIX INTELLIGENCE ══════ */}
      {(s?.aiFixSuggestions?.fixSuggestions?.length ?? 0) > 0 && (
        <div className="space-y-4">
          {/* Section header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="relative">
                <Wrench className="size-5 text-primary" />
                <span className="absolute -top-1 -right-1 size-2 rounded-full bg-primary animate-pulse" />
              </span>
              AI Fix Intelligence
              <Badge variant="secondary" className="text-[10px] font-mono ml-1">
                {s?.aiFixSuggestions?.fixSuggestions?.length || 0} fixes
              </Badge>
            </h2>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              {(s?.aiFixSuggestions?.fixSuggestions || []).filter((f: any) => String(f?.severity || "").toLowerCase() === "critical").length > 0 && (
                <Badge variant="destructive" className="text-[9px]">
                  {(s?.aiFixSuggestions?.fixSuggestions || []).filter((f: any) => String(f?.severity || "").toLowerCase() === "critical").length} Critical
                </Badge>
              )}
            </div>
          </div>

          {/* Fix cards */}
          {(s?.aiFixSuggestions?.fixSuggestions || []).map((fix: any, i: number) => (
            <FixIntelligenceCard key={i} fix={fix} index={i} />
          ))}
        </div>
      )}

      {/* ── GENERATED PLAYWRIGHT SCRIPTS ── */}
      {s?.generatedScripts && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2"><Code2 className="size-5 text-primary" /> Generated Playwright Scripts</h2>
          {[
            { label: "Login Test", code: s?.generatedScripts?.loginTest },
            { label: "Form Validation Test", code: s?.generatedScripts?.formValidationTest },
            { label: "Accessibility Test", code: s?.generatedScripts?.accessibilityTest },
            { label: "Performance Test", code: s?.generatedScripts?.performanceTest },
          ].filter(({ code }) => code).map(({ label, code }) => (
            <ScriptBlock key={label} label={label} code={safeStr(code)} />
          ))}
        </div>
      )}

      {/* ── REGRESSION RESULTS ── */}
      {(s?.regressionResults?.length ?? 0) > 0 && (
        <Section icon={<TrendingDown className="size-5 text-warning" />} title="Regression Analysis" className="border-warning/20">
          <div className="space-y-2">
            {(s?.regressionResults || []).map((reg: any, i: number) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${
                reg?.severity === "high" ? "border-destructive/30 bg-destructive/5" : "border-warning/20 bg-warning/5"
              }`}>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">{safeStr(reg?.type)}</p>
                  <p className="text-xs text-muted-foreground">{safeStr(reg?.page)}</p>
                  {reg?.issue && <p className="text-xs text-muted-foreground">{safeStr(reg?.issue)}</p>}
                  {reg?.previousLoadTime != null && reg?.currentLoadTime != null && (
                    <p className="text-xs text-muted-foreground">
                      {String(reg.previousLoadTime)}ms → {String(reg.currentLoadTime)}ms
                    </p>
                  )}
                </div>
                <Badge variant={reg?.severity === "high" ? "destructive" : "secondary"} className={reg?.severity !== "high" ? "bg-warning/15 text-warning border-warning/30" : ""}>
                  {safeStr(reg?.severity)}
                </Badge>
              </div>
            ))}
          </div>
          {!(s?.regressionResults?.length) && <span className="text-sm text-muted-foreground">No regressions detected.</span>}
        </Section>
      )}

      {/* ── MONITORING ENTRY ── */}
      {s?.monitoringEntry && (
        <Section icon={<MonitorCheck className="size-5 text-primary" />} title="Monitoring Snapshot">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-lg border border-border bg-background/50 p-3 text-center">
              <div className="text-lg font-bold text-primary">{safeStr(s?.monitoringEntry?.healthScore)}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Health Score</div>
            </div>
            <div className="rounded-lg border border-border bg-background/50 p-3 text-center">
              <div className="text-lg font-bold text-warning">{safeStr(s?.monitoringEntry?.regressionCount)}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Regressions</div>
            </div>
            <div className="rounded-lg border border-border bg-background/50 p-3 text-center">
              <div className="text-lg font-bold text-destructive">{safeStr(s?.monitoringEntry?.criticalIssues)}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Critical Issues</div>
            </div>
            <div className="rounded-lg border border-border bg-background/50 p-3 text-center">
              <div className="text-lg font-bold text-muted-foreground flex items-center justify-center gap-1"><Clock className="size-3.5" />{safeStr(s?.monitoringEntry?.timestamp)}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Recorded</div>
            </div>
          </div>
          {s?.monitoringEntry?.summary && (
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{safeStr(s?.monitoringEntry?.summary)}</p>
          )}
        </Section>
      )}

    </div>
  );
}

/* ─── Collapsible Script Block ─── */
function ScriptBlock({ label, code }: { label: string; code: string }) {
  const [open, setOpen] = useStateReact(false);
  const [copied, setCopied] = useStateReact(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <span className="text-sm font-semibold flex items-center gap-2">
          <Code2 className="size-4 text-primary" />{label}
        </span>
        {open ? <ChevronDown className="size-4 text-muted-foreground" /> : <ChevronRight className="size-4 text-muted-foreground" />}
      </button>
      {open && (
        <CardContent className="pt-0">
          <div className="relative">
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-1.5 rounded-md bg-background/80 border border-border hover:bg-accent transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5 text-muted-foreground" />}
            </button>
            <pre className="bg-background rounded-lg border border-border p-4 text-xs font-mono overflow-x-auto max-h-64 overflow-y-auto">
              <code>{code}</code>
            </pre>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

/* ─── Fix Suggestion Field ─── */
function FixField({ label, value, highlight = false }: { label: string; value: any; highlight?: boolean }) {
  return (
    <div>
      <p className={`text-[10px] uppercase tracking-wider font-bold mb-0.5 ${highlight ? "text-primary" : "text-muted-foreground"}`}>{label}</p>
      <p className={`text-sm ${highlight ? "text-foreground" : "text-muted-foreground"} leading-relaxed`}>{safeStr(value)}</p>
    </div>
  );
}

/* ─── Premium Fix Intelligence Card ─── */
function FixIntelligenceCard({ fix, index }: { fix: any; index: number }) {
  const [expanded, setExpanded] = useStateReact(false);
  const [codeCopied, setCodeCopied] = useStateReact(false);
  const [pwCopied, setPwCopied] = useStateReact(false);

  const sev = String(fix?.severity || "medium").toLowerCase();
  const isCrit = sev === "critical" || sev === "high";
  const isMed = sev === "medium";
  const borderColor = isCrit ? "border-red-500/40" : isMed ? "border-yellow-500/30" : "border-blue-500/30";
  const glowColor = isCrit ? "shadow-red-500/10" : isMed ? "shadow-yellow-500/10" : "shadow-blue-500/10";
  const sevBg = isCrit ? "bg-red-500/10 text-red-400" : isMed ? "bg-yellow-500/10 text-yellow-400" : "bg-blue-500/10 text-blue-400";
  const dotColor = isCrit ? "bg-red-500" : isMed ? "bg-yellow-500" : "bg-blue-500";

  const copyCode = (text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className={`rounded-xl border ${borderColor} bg-card/80 backdrop-blur-sm shadow-lg ${glowColor} transition-all duration-300 hover:shadow-xl`}>
      {/* Collapsed header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-5 flex items-start gap-4"
      >
        {/* Severity dot */}
        <div className="mt-1 shrink-0">
          <span className={`block size-3 rounded-full ${dotColor} ${isCrit ? "animate-pulse" : ""}`} />
        </div>

        {/* Title + summary */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${sevBg}`}>
              {safeStr(fix?.severity)}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">FIX-{String(index + 1).padStart(3, "0")}</span>
          </div>
          <p className="text-sm font-bold leading-snug">{safeStr(fix?.title || fix?.issue)}</p>
          {fix?.recommendedFix && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{safeStr(fix.recommendedFix)}</p>
          )}
        </div>

        {/* Expand icon */}
        <div className="shrink-0 mt-1">
          {expanded ? <ChevronDown className="size-4 text-muted-foreground" /> : <ChevronRight className="size-4 text-muted-foreground" />}
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-border/50 pt-4">

          {/* Analysis grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fix?.rootCause && (
              <div className="rounded-lg border border-border bg-background/60 p-3">
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mb-1.5 flex items-center gap-1">
                  <Bug className="size-3" /> Root Cause
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">{safeStr(fix.rootCause)}</p>
              </div>
            )}
            {fix?.whyItHappens && (
              <div className="rounded-lg border border-border bg-background/60 p-3">
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mb-1.5 flex items-center gap-1">
                  <AlertTriangle className="size-3" /> Why This Happens
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">{safeStr(fix.whyItHappens)}</p>
              </div>
            )}
          </div>

          {/* Impact cards */}
          {(fix?.businessImpact || fix?.userImpact) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {fix?.businessImpact && (
                <div className={`rounded-lg border p-3 ${isCrit ? "border-red-500/20 bg-red-500/5" : "border-border bg-background/40"}`}>
                  <p className="text-[9px] uppercase tracking-widest font-bold mb-1.5 text-muted-foreground">📊 Business Impact</p>
                  <p className="text-xs leading-relaxed">{safeStr(fix.businessImpact)}</p>
                </div>
              )}
              {fix?.userImpact && (
                <div className={`rounded-lg border p-3 ${isCrit ? "border-red-500/20 bg-red-500/5" : "border-border bg-background/40"}`}>
                  <p className="text-[9px] uppercase tracking-widest font-bold mb-1.5 text-muted-foreground">👤 User Impact</p>
                  <p className="text-xs leading-relaxed">{safeStr(fix.userImpact)}</p>
                </div>
              )}
            </div>
          )}

          {/* Recommended fix — highlighted */}
          {fix?.recommendedFix && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
              <p className="text-[9px] uppercase tracking-widest text-primary font-bold mb-1.5 flex items-center gap-1">
                <Lightbulb className="size-3" /> Recommended Fix
              </p>
              <p className="text-sm leading-relaxed">{safeStr(fix.recommendedFix)}</p>
            </div>
          )}

          {/* Code fix */}
          {(fix?.suggestedCodeFix || fix?.suggestedCode) && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-1">
                  <Code2 className="size-3" /> Suggested Code Fix
                </p>
                <button
                  onClick={() => copyCode(safeStr(fix?.suggestedCodeFix || fix?.suggestedCode), setCodeCopied)}
                  className="flex items-center gap-1 text-[10px] px-2 py-1 rounded border border-border bg-background hover:bg-accent transition-colors"
                >
                  {codeCopied ? <><Check className="size-3 text-green-500" /> Copied</> : <><Copy className="size-3" /> Copy</>}
                </button>
              </div>
              <pre className="bg-[#0d1117] rounded-lg border border-border p-4 text-xs font-mono overflow-x-auto max-h-48 overflow-y-auto text-green-400 whitespace-pre-wrap">
                <code>{safeStr(fix?.suggestedCodeFix || fix?.suggestedCode)}</code>
              </pre>
            </div>
          )}

          {/* Playwright strategy */}
          {fix?.playwrightRecommendation && (
            <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-purple-500/10">
                <p className="text-[9px] uppercase tracking-widest text-purple-400 font-bold flex items-center gap-1">
                  🎭 Playwright Strategy
                </p>
                <button
                  onClick={() => copyCode(safeStr(fix.playwrightRecommendation), setPwCopied)}
                  className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border border-purple-500/20 bg-background/50 hover:bg-accent transition-colors"
                >
                  {pwCopied ? <><Check className="size-3 text-green-500" /> Copied</> : <><Copy className="size-3" /> Copy</>}
                </button>
              </div>
              <pre className="p-4 text-xs font-mono overflow-x-auto max-h-48 overflow-y-auto text-purple-300 whitespace-pre-wrap">
                <code>{safeStr(fix.playwrightRecommendation)}</code>
              </pre>
            </div>
          )}

          {/* Developer guidance */}
          {(fix?.developerGuidance || fix?.developerRecommendation) && (
            <div className="border-l-2 border-primary/40 pl-4 py-2">
              <p className="text-[9px] uppercase tracking-widest text-primary font-bold mb-1 flex items-center gap-1">
                <Shield className="size-3" /> Developer Guidance
              </p>
              <p className="text-xs leading-relaxed text-foreground/80">{safeStr(fix?.developerGuidance || fix?.developerRecommendation)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
