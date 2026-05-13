import { Link } from "@tanstack/react-router";
import { ReactNode } from "react";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-10 border-r border-border bg-card relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />
        <Link to="/" className="relative flex items-center gap-2 font-display font-bold tracking-tight">
          <span className="size-6 rounded-md bg-primary/15 border border-primary/30 grid place-items-center">
            <span className="size-2 rounded-sm bg-primary rotate-45" />
          </span>
          PROTOSCAN.AI
        </Link>

        <div className="relative space-y-6">
          <p className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest">Live agents</p>
          <div className="space-y-3">
            {[
              { name: "checkout-v4", status: "scanning", value: "67%" },
              { name: "dashboard-main", status: "passed", value: "96/100" },
              { name: "user-onboarding", status: "passed", value: "94/100" },
            ].map((s) => (
              <div key={s.name} className="rounded-lg border border-border bg-background p-4 flex justify-between items-center">
                <div>
                  <div className="font-mono text-sm">{s.name}</div>
                  <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">{s.status}</div>
                </div>
                <div className="text-xs font-mono text-primary">{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-xs text-muted-foreground font-mono">
          "We catch regressions before they ship. Protoscan replaced 14k lines of brittle tests."
          <div className="mt-2">— Tomás Riedel, Northchart</div>
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-sm mx-auto">
          <Link to="/" className="lg:hidden flex items-center gap-2 font-display font-bold mb-8 tracking-tight">
            <span className="size-6 rounded-md bg-primary/15 border border-primary/30 grid place-items-center">
              <span className="size-2 rounded-sm bg-primary rotate-45" />
            </span>
            PROTOSCAN.AI
          </Link>
          <h1 className="text-2xl font-display font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-sm text-center text-muted-foreground">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

export function SocialButtons() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button className="border border-border bg-background hover:bg-accent rounded-lg px-3 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2">
        <svg viewBox="0 0 24 24" className="size-4"><path fill="currentColor" d="M21.35 11.1h-9.18v2.92h5.27c-.23 1.5-1.7 4.4-5.27 4.4-3.17 0-5.76-2.62-5.76-5.85s2.59-5.85 5.76-5.85c1.8 0 3.01.77 3.7 1.43l2.52-2.43C16.85 4.18 14.7 3.2 12.17 3.2 6.96 3.2 2.75 7.4 2.75 12.6s4.21 9.4 9.42 9.4c5.43 0 9.04-3.82 9.04-9.2 0-.62-.07-1.1-.16-1.7z"/></svg>
        Google
      </button>
      <button className="border border-border bg-background hover:bg-accent rounded-lg px-3 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2">
        <svg viewBox="0 0 24 24" className="size-4"><path fill="currentColor" d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.9 1.3 3.6 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.7-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3"/></svg>
        GitHub
      </button>
    </div>
  );
}
