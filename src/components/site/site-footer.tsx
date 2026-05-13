import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-12 px-6 bg-background">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex flex-col gap-2">
          <span className="font-display font-bold text-lg tracking-tight">PROTOSCAN.AI</span>
          <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
            EST 2024 • DISTRIBUTED QA NETWORK
          </p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
          <Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
          <Link to="/docs" className="hover:text-primary transition-colors">Docs</Link>
          <Link to="/about" className="hover:text-primary transition-colors">About</Link>
          <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
          <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
          <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
