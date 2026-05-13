import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Mail, MessageSquare, Building2 } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — Protoscan.ai" },
      { name: "description", content: "Get in touch with the Protoscan team. Sales, support, and partnerships." },
      { property: "og:title", content: "Contact — Protoscan.ai" },
      { property: "og:description", content: "Get in touch with the Protoscan team." },
    ],
  }),
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="px-6 py-24 max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
        <div>
          <p className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest mb-3">Contact</p>
          <h1 className="text-4xl font-display font-bold tracking-tight">Talk to the team.</h1>
          <p className="mt-4 text-muted-foreground">
            Sales, support, partnerships, or feedback — we're all ears. We respond within 24 hours.
          </p>
          <div className="mt-8 space-y-4">
            {[
              { icon: Mail, label: "Email", value: "hello@protoscan.ai" },
              { icon: MessageSquare, label: "Support", value: "support@protoscan.ai" },
              { icon: Building2, label: "Office", value: "Stockholm · San Francisco" },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-3">
                <span className="size-9 rounded-md border border-border bg-card grid place-items-center">
                  <c.icon className="size-4 text-primary" />
                </span>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{c.label}</div>
                  <div className="text-sm font-mono">{c.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          {sent ? (
            <div className="text-center py-12">
              <div className="size-12 mx-auto rounded-full bg-primary/10 grid place-items-center text-primary mb-4">✓</div>
              <h3 className="font-display font-semibold">Message received</h3>
              <p className="text-sm text-muted-foreground mt-2">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
              <Field label="Name" placeholder="Ada Lovelace" />
              <Field label="Work email" placeholder="you@company.com" mono />
              <Field label="Company" placeholder="Acme Inc." />
              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">How can we help?</label>
                <textarea
                  rows={4}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/50 resize-none"
                  placeholder="Tell us a bit about your team and use case..."
                />
              </div>
              <button className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-bold hover:brightness-110 transition-all">
                Send message
              </button>
            </form>
          )}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function Field({ label, placeholder, mono }: { label: string; placeholder: string; mono?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        placeholder={placeholder}
        className={`w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/50 ${mono ? "font-mono" : ""}`}
      />
    </div>
  );
}
