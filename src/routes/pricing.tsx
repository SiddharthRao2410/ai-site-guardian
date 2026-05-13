import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({
    meta: [
      { title: "Pricing — Protoscan.ai" },
      { name: "description", content: "Transparent usage-based pricing for AI website testing. Start free, scale as you grow." },
      { property: "og:title", content: "Pricing — Protoscan.ai" },
      { property: "og:description", content: "Transparent usage-based pricing for AI website testing." },
    ],
  }),
});

const tiers = [
  { name: "Starter", price: "$0", desc: "Solo developers and side projects.", features: ["50 scans / month", "1 project", "Community support", "7-day report retention"], cta: "Start free", highlight: false },
  { name: "Pro", price: "$49", desc: "Growing teams shipping continuously.", features: ["2,000 scans / month", "Unlimited projects", "GitHub PR integration", "AI fix suggestions", "30-day retention", "Slack notifications"], cta: "Start trial", highlight: true },
  { name: "Enterprise", price: "Custom", desc: "Custom limits, SSO and dedicated infra.", features: ["Unlimited scans", "SOC2 + SSO", "Private agents", "SLA + DPA", "Dedicated support", "Custom integrations"], cta: "Talk to sales", highlight: false },
];

function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="px-6 py-24 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest mb-3">Pricing</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">Pay for what you ship.</h1>
          <p className="mt-4 text-muted-foreground">Transparent usage-based pricing. Cancel anytime.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((p) => (
            <div key={p.name} className={`relative p-6 rounded-xl border bg-card flex flex-col ${p.highlight ? "border-primary/50 glow-primary" : "border-border"}`}>
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
                className={`mt-auto text-center py-2 rounded-lg text-sm font-semibold transition-colors ${p.highlight ? "bg-primary text-primary-foreground hover:brightness-110" : "border border-border bg-background hover:bg-accent"}`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <h2 className="text-2xl font-display font-bold tracking-tight mb-6">Frequently asked</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { q: "What counts as a scan?", a: "One agent run against a single URL. A scan can include hundreds of test cases." },
              { q: "Can I bring my own AI keys?", a: "Enterprise plans support BYO OpenAI / Anthropic keys." },
              { q: "Do you offer annual discounts?", a: "Yes — 20% off when paid annually on Pro and Enterprise." },
              { q: "Is there a free trial?", a: "Pro includes a 14-day free trial. Starter is free forever." },
            ].map((f) => (
              <div key={f.q} className="rounded-xl border border-border bg-card p-5">
                <h4 className="font-display font-semibold">{f.q}</h4>
                <p className="text-sm text-muted-foreground mt-2">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
