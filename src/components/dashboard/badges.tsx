import { ScanStatus } from "@/lib/mock-data";

export function StatusBadge({ status }: { status: ScanStatus | "passed" | "failed" | "warning" | "running" }) {
  const map: Record<string, string> = {
    passed: "bg-success/10 text-success border-success/20",
    failed: "bg-destructive/10 text-destructive border-destructive/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    running: "bg-primary/10 text-primary border-primary/20",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${map[status]}`}>
      {status === "running" && <span className="size-1.5 rounded-full bg-primary animate-pulse-dot" />}
      {status}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: "critical" | "high" | "medium" | "low" }) {
  const map: Record<string, string> = {
    critical: "bg-destructive/10 text-destructive border-destructive/20",
    high: "bg-destructive/10 text-destructive border-destructive/20",
    medium: "bg-warning/10 text-warning border-warning/20",
    low: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${map[severity]}`}>
      {severity}
    </span>
  );
}
