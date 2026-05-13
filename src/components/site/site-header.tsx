import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-base tracking-tight">
            <span className="size-6 rounded-md bg-primary/15 border border-primary/30 grid place-items-center">
              <span className="size-2 rounded-sm bg-primary rotate-45" />
            </span>
            PROTOSCAN.AI
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Link to="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Documentation</Link>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/login" className="text-sm font-medium px-3 py-1.5 hover:bg-accent rounded transition-colors">
            Log in
          </Link>
          <Link to="/signup" className="text-sm font-semibold bg-foreground text-background px-4 py-1.5 rounded hover:bg-foreground/90 transition-colors">
            Deploy Agent
          </Link>
        </div>
      </div>
    </nav>
  );
}
