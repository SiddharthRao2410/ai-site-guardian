import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Book, Zap, Code, Bot } from "lucide-react";

export const Route = createFileRoute("/docs")({
  component: DocsPage,
  head: () => ({
    meta: [
      { title: "Documentation — Protoscan.ai" },
      { name: "description", content: "Get started with Protoscan in minutes. Guides, API reference, and integration tutorials." },
      { property: "og:title", content: "Documentation — Protoscan.ai" },
      { property: "og:description", content: "Get started with Protoscan in minutes." },
    ],
  }),
});

const sections = [
  { icon: Zap, title: "Quickstart", body: "Run your first AI scan in under 60 seconds.", link: "Read guide" },
  { icon: Bot, title: "Agents & Flows", body: "How autonomous agents explore your site and generate test cases.", link: "Learn more" },
  { icon: Code, title: "REST API", body: "Trigger scans, fetch reports, and integrate with your CI pipeline.", link: "API reference" },
  { icon: Book, title: "Best Practices", body: "Recommended setups for SaaS, e-commerce, and content sites.", link: "Read playbook" },
];

function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <p className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest mb-3">Documentation</p>
        <h1 className="text-4xl font-display font-bold tracking-tight">Build with Protoscan.</h1>
        <p className="mt-4 text-muted-foreground max-w-xl">
          Everything you need to deploy autonomous testing agents into your workflow.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((s) => (
            <Link key={s.title} to="/docs" className="group p-6 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors">
              <s.icon className="size-5 text-primary mb-4" />
              <h3 className="font-display font-semibold">{s.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{s.body}</p>
              <span className="mt-4 inline-block text-xs text-primary group-hover:underline">{s.link} →</span>
            </Link>
          ))}
        </div>

        <div className="mt-16 rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Quickstart · curl
          </div>
          <pre className="p-5 text-xs font-mono overflow-x-auto text-foreground/90">
{`curl -X POST https://api.protoscan.ai/v1/scans \\
  -H "Authorization: Bearer $PROTOSCAN_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://your-site.com",
    "depth": "standard",
    "browser": "chrome"
  }'`}
          </pre>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
