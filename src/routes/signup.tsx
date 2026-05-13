import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, SocialButtons } from "@/components/auth/auth-shell";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({ meta: [{ title: "Sign up — Protoscan.ai" }] }),
});

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AuthShell
      title="Deploy your first agent"
      subtitle="50 free scans per month. No credit card required."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">Log in</Link>
        </>
      }
    >
      <SocialButtons />
      <div className="my-6 flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
        <span className="flex-1 h-px bg-border" /> or <span className="flex-1 h-px bg-border" />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ to: "/dashboard" });
        }}
        className="space-y-4"
      >
        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ada Lovelace"
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Work email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-mono outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-mono outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-bold hover:brightness-110 transition-all"
        >
          Create account
        </button>
        <p className="text-xs text-muted-foreground text-center">
          By continuing you agree to our{" "}
          <Link to="/terms" className="text-foreground hover:underline">Terms</Link> and{" "}
          <Link to="/privacy" className="text-foreground hover:underline">Privacy</Link>.
        </p>
      </form>
    </AuthShell>
  );
}
