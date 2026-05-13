import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <Section title="Profile" desc="Your personal information.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Name" defaultValue="Ada Lovelace" />
          <Field label="Email" defaultValue="ada@protoscan.ai" mono />
        </div>
      </Section>

      <Section title="Workspace" desc="Defaults applied to every new scan.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Workspace name" defaultValue="Acme Inc." />
          <Field label="Default browser" defaultValue="Chrome 122" />
        </div>
      </Section>

      <Section title="Notifications" desc="How we reach you when scans complete.">
        <Toggle label="Email me when a scan finishes" defaultChecked />
        <Toggle label="Notify on critical failures only" />
        <Toggle label="Slack integration" />
      </Section>

      <Section title="Danger zone" desc="Irreversible actions.">
        <button className="border border-destructive/30 text-destructive px-4 py-2 rounded-md text-sm font-medium hover:bg-destructive/10 transition-colors">
          Delete workspace
        </button>
      </Section>
    </div>
  );
}

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <header className="mb-4">
        <h3 className="font-display font-semibold">{title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{desc}</p>
      </header>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({ label, defaultValue, mono }: { label: string; defaultValue: string; mono?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        defaultValue={defaultValue}
        className={`w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/50 ${mono ? "font-mono" : ""}`}
      />
    </div>
  );
}

function Toggle({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center justify-between py-1.5 cursor-pointer">
      <span className="text-sm">{label}</span>
      <input type="checkbox" defaultChecked={defaultChecked} className="size-4 accent-[oklch(0.78_0.14_210)]" />
    </label>
  );
}
