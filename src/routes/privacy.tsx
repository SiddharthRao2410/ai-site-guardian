import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({ meta: [{ title: "Privacy Policy — Protoscan.ai" }] }),
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <article className="px-6 py-24 max-w-3xl mx-auto">
        <p className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest mb-3">Legal</p>
        <h1 className="text-4xl font-display font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-xs text-muted-foreground mt-2 font-mono">Last updated: November 2026</p>

        <div className="mt-10 space-y-6 text-sm text-muted-foreground leading-relaxed">
          <Section title="Data we collect">
            Account info (name, email), scan configuration, and usage telemetry. We do not sell personal data.
          </Section>
          <Section title="Scan content">
            Screenshots and console logs from your scans are stored encrypted at rest. Retention follows your plan.
          </Section>
          <Section title="Subprocessors">
            We use AWS, Cloudflare, and OpenAI. Full list available on request for Enterprise customers.
          </Section>
          <Section title="Your rights">
            Request export or deletion at privacy@protoscan.ai. We respond within 30 days.
          </Section>
          <Section title="Contact">
            Questions? Email privacy@protoscan.ai.
          </Section>
        </div>
      </article>
      <SiteFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-base font-display font-semibold text-foreground mb-2">{title}</h2>
      <p>{children}</p>
    </section>
  );
}
