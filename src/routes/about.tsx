import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — Protoscan.ai" },
      { name: "description", content: "We're building autonomous QA so engineering teams can ship without fear." },
      { property: "og:title", content: "About — Protoscan.ai" },
      { property: "og:description", content: "We're building autonomous QA so engineering teams can ship without fear." },
    ],
  }),
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="px-6 py-24 max-w-4xl mx-auto">
        <p className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest mb-3">About</p>
        <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">Ship without fear.</h1>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          Protoscan is building the autonomous QA layer for the modern web. We believe testing should be a
          background process — not a multi-day ritual that blocks releases.
        </p>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Founded by engineers who spent too many late nights debugging production regressions, we're combining
          large language models with browser automation to create QA agents that actually understand your product.
        </p>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { v: "2024", l: "Founded" },
            { v: "8.4M", l: "Scans run" },
            { v: "$12M", l: "Series A" },
            { v: "24", l: "Engineers" },
          ].map((s) => (
            <div key={s.l} className="rounded-xl border border-border bg-card p-5">
              <div className="text-2xl font-display font-bold">{s.v}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-display font-bold tracking-tight">Backed by</h2>
          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground font-mono">
            <span>Sequoia</span><span>·</span><span>YC</span><span>·</span><span>Index Ventures</span><span>·</span><span>Founders Fund</span>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
