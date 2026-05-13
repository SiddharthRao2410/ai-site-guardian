import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/auth/auth-shell";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
  head: () => ({ meta: [{ title: "Reset password — Protoscan.ai" }] }),
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <AuthShell
      title="Reset your password"
      subtitle="We'll send you a secure reset link."
      footer={
        <>
          Remembered it?{" "}
          <Link to="/login" className="text-primary hover:underline">Back to log in</Link>
        </>
      }
    >
      {sent ? (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm">
          Check <span className="font-mono text-primary">{email}</span> for a reset link. It expires in 30 minutes.
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-mono outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-bold hover:brightness-110 transition-all"
          >
            Send reset link
          </button>
        </form>
      )}
    </AuthShell>
  );
}
