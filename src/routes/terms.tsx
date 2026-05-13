import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({ meta: [{ title: "Terms of Service — Protoscan.ai" }] }),
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <article className="px-6 py-24 max-w-3xl mx-auto prose-style">
        <p className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest mb-3">Legal</p>
        <h1 className="text-4xl font-display font-bold tracking-tight">Terms of Service</h1>
        <p className="text-xs text-muted-foreground mt-2 font-mono">Last updated: November 2026</p>

        <div className="mt-10 space-y-6 text-sm text-muted-foreground leading-relaxed">
          <Section title="1. Acceptance">
            By accessing or using Protoscan, you agree to be bound by these Terms. If you do not agree, you may not use the service.
          </Section>
          <Section title="2. Use of service">
            You may use Protoscan to test websites you own or have explicit permission to test. Unauthorized scanning is prohibited.
          </Section>
          <Section title="3. Account & billing">
            You are responsible for maintaining account security and for all charges incurred under your plan.
          </Section>
          <Section title="4. Acceptable use">
            Don't use Protoscan to attack, overload, or damage third-party services. We may suspend accounts that violate this policy.
          </Section>
          <Section title="5. Termination">
            Either party may terminate the agreement at any time. We will retain your data for 30 days after termination unless requested otherwise.
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
