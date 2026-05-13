import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import {
  ArrowRight,
  Bot,
  Eye,
  GitBranch,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
  Check,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const [url, setUrl] = useState("");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Hero */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono font-bold tracking-widest uppercase mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="size-1.5 bg-primary rounded-full animate-pulse-dot" />
            v2.0 Engine Live
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-balance mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            AI-Powered Website Testing <br className="hidden md:block" />
            <span className="gradient-text">& Bug Detection</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty mb-10 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-100">
            Automatically test websites, detect failures, analyze user flows, and generate intelligent QA reports using autonomous AI agents.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = "/signup";
            }}
            className="relative max-w-2xl mx-auto p-1 bg-card border border-border rounded-xl shadow-2xl glow-primary animate-in fade-in slide-in-from-bottom-16 duration-700 delay-200"
          >
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">https://</span>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="example.com"
                  className="w-full bg-transparent border-0 pl-[4.5rem] pr-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground/40 outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold text-sm tracking-tight hover:brightness-110 transition-all flex items-center justify-center gap-2 group"
              >
                Start AI Testing
                <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </form>

          <p className="mt-4 text-xs font-mono text-muted-foreground/70">
            No credit card required · 50 free scans / month
          </p>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-2xl">
          <div className="border-b border-border p-5 flex items-center justify-between bg-background/40">
            <div className="flex items-center gap-3">
              <div className="relative size-10 rounded-full border-2 border-primary/30 grid place-items-center">
                <span className="text-xs font-mono font-bold">94</span>
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm">Report: alpha-landing-page</h3>
                <p className="text-[11px] text-muted-foreground font-mono">Runtime: 42s · Agents: 5</p>
              </div>
            </div>
            <div className="hidden sm:flex gap-2">
              <span className="px-2 py-1 rounded bg-success/10 text-success text-[10px] font-mono border border-success/20">PASS 182</span>
              <span className="px-2 py-1 rounded bg-destructive/10 text-destructive text-[10px] font-mono border border-destructive/20">FAIL 3</span>
              <span className="px-2 py-1 rounded bg-warning/10 text-warning text-[10px] font-mono border border-warning/20">WARN 12</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            <div className="bg-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-destructive font-bold uppercase tracking-wider">Critical</span>
                <span className="text-[10px] font-mono text-muted-foreground">/checkout</span>
              </div>
              <h4 className="text-base font-semibold">Checkout CTA unreachable on Mobile</h4>
              <div className="font-mono text-[11px] bg-background border border-border rounded-md p-3 text-muted-foreground overflow-x-auto whitespace-pre">
<span className="text-destructive">Error:</span> #buy-now-btn obscured by .cookie-banner
  at click_action (agent.js:142)
              </div>
            </div>
            <div className="bg-card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="size-3.5 text-primary" />
                <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider">AI Suggested Fix</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Cookie banner z-index (1000) overlays the checkout button and fails to dismiss on touch.
              </p>
              <div className="font-mono text-[11px] bg-background border border-border rounded-md p-3">
                <div className="text-muted-foreground/60">// suggested CSS override</div>
                <div className="text-primary">.cookie-banner {`{`}</div>
                <div className="pl-4 text-foreground/70">z-index: 50;</div>
                <div className="pl-4 text-foreground/70">pointer-events: none;</div>
                <div className="text-primary">{`}`}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-border">
        <div className="max-w-2xl mb-16">
          <p className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest mb-3">Capabilities</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight">Everything QA needs, automated.</h2>
          <p className="mt-4 text-muted-foreground">From crawl to report — autonomous agents handle the entire test lifecycle.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { i: "01", icon: Eye, title: "Visual Regressions", body: "Pixel-perfect comparison across 50+ device viewports using headless Chromium clusters." },
            { i: "02", icon: Bot, title: "Self-Healing Selectors", body: "When CSS classes change, our AI updates selectors automatically to prevent brittle suites." },
            { i: "03", icon: Workflow, title: "Flow Analysis", body: "AI agents explore every possible user journey to surface dead-ends and friction." },
            { i: "04", icon: Zap, title: "Performance Audits", body: "Core Web Vitals tracked per release with regression alerts to your team." },
            { i: "05", icon: ShieldCheck, title: "Accessibility Scans", body: "WCAG 2.2 AA coverage with prioritized, actionable remediation guidance." },
            { i: "06", icon: GitBranch, title: "GitHub Integration", body: "AI-generated pull requests with the exact patch — review and merge in one click." },
          ].map((f) => (
            <div key={f.i} className="p-6 rounded-xl border border-border bg-card hover:border-primary/40 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="size-10 rounded-lg bg-background border border-border grid place-items-center group-hover:border-primary/30 transition-colors">
                  <f.icon className="size-4 text-primary" />
                </div>
                <span className="text-xs font-mono text-muted-foreground">{f.i}</span>
              </div>
              <h4 className="font-display font-semibold text-base tracking-tight">{f.title}</h4>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-24 border-t border-border">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight">Pay for the runs you ship.</h2>
          <p className="mt-4 text-muted-foreground">Transparent usage-based pricing. Scale agents up or down with no commitment.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Starter", price: "$0", desc: "For solo developers and small projects.", features: ["50 scans / month", "1 project", "Community support", "7-day report retention"], cta: "Start free", highlight: false },
            { name: "Pro", price: "$49", desc: "For growing teams shipping continuously.", features: ["2,000 scans / month", "Unlimited projects", "GitHub PR integration", "AI fix suggestions", "30-day retention"], cta: "Start trial", highlight: true },
            { name: "Enterprise", price: "Custom", desc: "Custom limits, SSO, and dedicated infra.", features: ["Unlimited scans", "SOC2 + SSO", "Private agents", "SLA + DPA", "Dedicated support"], cta: "Talk to sales", highlight: false },
          ].map((p) => (
            <div
              key={p.name}
              className={`relative p-6 rounded-xl border bg-card flex flex-col ${
                p.highlight ? "border-primary/50 glow-primary" : "border-border"
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-2 left-6 text-[10px] font-mono uppercase tracking-widest bg-primary text-primary-foreground px-2 py-0.5 rounded">
                  Popular
                </span>
              )}
              <h3 className="font-display font-bold text-lg">{p.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
              <div className="mt-6 mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-display font-bold">{p.price}</span>
                {p.price !== "Custom" && <span className="text-sm text-muted-foreground">/ mo</span>}
              </div>
              <ul className="space-y-2.5 mb-8 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="size-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className={`mt-auto text-center py-2 rounded-lg text-sm font-semibold transition-colors ${
                  p.highlight
                    ? "bg-primary text-primary-foreground hover:brightness-110"
                    : "border border-border bg-background hover:bg-accent"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-border">
        <div className="max-w-2xl mb-16">
          <p className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest mb-3">Trusted by</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight">Engineering teams that ship faster.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { quote: "We caught a checkout regression 4 hours before it would have hit production. The AI fix patch was correct on the first try.", name: "Maya Hernandez", role: "Staff Engineer · Linewave" },
            { quote: "Replaced 14k lines of brittle Cypress tests. Onboarding takes minutes, the agent figures the rest out.", name: "Tomás Riedel", role: "Eng Lead · Northchart" },
            { quote: "Accessibility audits used to take a week. Now it's part of every PR review automatically.", name: "Priya Anand", role: "Director of QA · Halcyon" },
          ].map((t) => (
            <figure key={t.name} className="p-6 rounded-xl border border-border bg-card">
              <blockquote className="text-sm leading-relaxed text-foreground/90">"{t.quote}"</blockquote>
              <figcaption className="mt-6 pt-6 border-t border-border">
                <div className="font-semibold text-sm">{t.name}</div>
                <div className="text-xs text-muted-foreground font-mono">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="rounded-2xl border border-border bg-card p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight max-w-2xl mx-auto">
              Stop debugging in production.
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Deploy your first AI testing agent in under 60 seconds. Free forever for personal projects.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Link to="/signup" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold text-sm hover:brightness-110 transition-all inline-flex items-center gap-2">
                Deploy Agent <ArrowRight className="size-4" />
              </Link>
              <Link to="/docs" className="border border-border px-6 py-3 rounded-lg font-medium text-sm hover:bg-accent transition-colors">
                Read the docs
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
