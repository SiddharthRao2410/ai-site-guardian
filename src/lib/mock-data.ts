export type ScanStatus = "passed" | "failed" | "warning" | "running";

export interface Scan {
  id: string;
  url: string;
  name: string;
  status: ScanStatus;
  score: number;
  passed: number;
  failed: number;
  warnings: number;
  duration: string;
  timestamp: string;
  browser: string;
  device: string;
}

export const scans: Scan[] = [
  { id: "QA-7729-XJ", url: "app.acme.com", name: "checkout-v4", status: "failed", score: 78, passed: 142, failed: 8, warnings: 12, duration: "1m 42s", timestamp: "14m ago", browser: "Chrome 122", device: "Desktop" },
  { id: "QA-7728-MK", url: "app.acme.com", name: "dashboard-main", status: "passed", score: 96, passed: 188, failed: 0, warnings: 4, duration: "2m 11s", timestamp: "1h ago", browser: "Chrome 122", device: "Desktop" },
  { id: "QA-7727-PQ", url: "marketing.acme.com", name: "landing-alpha", status: "warning", score: 88, passed: 175, failed: 2, warnings: 9, duration: "55s", timestamp: "3h ago", browser: "Safari 17", device: "Mobile" },
  { id: "QA-7726-LV", url: "app.acme.com", name: "user-onboarding", status: "passed", score: 94, passed: 162, failed: 0, warnings: 6, duration: "3m 02s", timestamp: "6h ago", browser: "Firefox 124", device: "Desktop" },
  { id: "QA-7725-AB", url: "docs.acme.com", name: "documentation-flow", status: "passed", score: 99, passed: 204, failed: 0, warnings: 1, duration: "1m 28s", timestamp: "1d ago", browser: "Chrome 122", device: "Tablet" },
  { id: "QA-7724-CD", url: "app.acme.com", name: "billing-portal", status: "failed", score: 71, passed: 98, failed: 12, warnings: 18, duration: "2m 49s", timestamp: "2d ago", browser: "Edge 122", device: "Desktop" },
];

export interface TestCase {
  id: string;
  name: string;
  status: "passed" | "failed" | "warning";
  duration: string;
  browser: string;
  timestamp: string;
}

export const testCases: TestCase[] = [
  { id: "1", name: "Homepage loads under 2s", status: "passed", duration: "1.4s", browser: "Chrome", timestamp: "12:42:01" },
  { id: "2", name: "Sign in form submission", status: "passed", duration: "0.8s", browser: "Chrome", timestamp: "12:42:09" },
  { id: "3", name: "Cart dispatch logic", status: "failed", duration: "3.2s", browser: "Chrome", timestamp: "12:42:14" },
  { id: "4", name: "Product image lazy load", status: "warning", duration: "2.1s", browser: "Safari", timestamp: "12:42:21" },
  { id: "5", name: "Mobile menu opens correctly", status: "passed", duration: "0.4s", browser: "Mobile Safari", timestamp: "12:42:27" },
  { id: "6", name: "Newsletter signup validation", status: "failed", duration: "1.8s", browser: "Firefox", timestamp: "12:42:33" },
  { id: "7", name: "Checkout payment flow", status: "passed", duration: "4.1s", browser: "Chrome", timestamp: "12:42:42" },
  { id: "8", name: "Footer links resolve", status: "warning", duration: "0.6s", browser: "Chrome", timestamp: "12:42:46" },
];

export interface Failure {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  consoleLog: string;
  suggestedFix: string;
  selector: string;
  page: string;
}

export const failures: Failure[] = [
  {
    id: "F-001",
    title: "Cart Dispatch Logic Failure",
    severity: "critical",
    description: "The 'Checkout' button failed to trigger the stripe-session-v2 redirection. User remained on the cart page without visual feedback.",
    consoleLog: "Error: Element #buy-now-btn is obscured by div.cookie-banner\n  at click_action (agent_runtime.js:142)\n  at flow_executor (engine.ts:88)",
    suggestedFix: "Update selector from .btn-primary to [data-qa=\"submit-order\"]. The class is being obfuscated by the production build.",
    selector: ".btn-primary",
    page: "/checkout",
  },
  {
    id: "F-002",
    title: "Newsletter Signup Validation Bypass",
    severity: "high",
    description: "Empty email field passes client-side validation and triggers a 500 server response.",
    consoleLog: "POST /api/newsletter 500\n  ValidationError: email cannot be empty\n  at validateRequest (server.ts:41)",
    suggestedFix: "Add required attribute to <input type=\"email\"> and disable submit button until input matches RFC 5322.",
    selector: "form#newsletter input",
    page: "/",
  },
  {
    id: "F-003",
    title: "Mobile Heading Overflow",
    severity: "medium",
    description: "Heading 'Exclusive Winter Collection' exceeds container width on iPhone 13 Pro viewport (390px).",
    consoleLog: "[Layout] horizontal scroll detected on body\n  width: 412px (viewport: 390px)",
    suggestedFix: "Apply text-balance and reduce headline font-size on screens < 400px.",
    selector: "h1.hero-title",
    page: "/",
  },
  {
    id: "F-004",
    title: "Broken Documentation Link",
    severity: "low",
    description: "Anchor /docs/getting-started/install returns 404.",
    consoleLog: "GET /docs/getting-started/install 404",
    suggestedFix: "Update href to /docs/installation or restore the legacy slug via redirect.",
    selector: "a[href*=\"install\"]",
    page: "/docs",
  },
];

export interface Suggestion {
  id: string;
  title: string;
  category: "Performance" | "Accessibility" | "SEO" | "UX" | "Security";
  impact: "High" | "Medium" | "Low";
  description: string;
}

export const aiSuggestions: Suggestion[] = [
  { id: "S-1", title: "Lazy-load below-the-fold imagery", category: "Performance", impact: "High", description: "Defer 14 images outside the initial viewport. Estimated LCP improvement: 480ms." },
  { id: "S-2", title: "Add aria-label to icon buttons", category: "Accessibility", impact: "High", description: "12 interactive icons lack accessible names. Screen readers will announce them as 'button'." },
  { id: "S-3", title: "Pre-connect to fonts.gstatic.com", category: "Performance", impact: "Medium", description: "Save ~120ms on first contentful paint by pre-establishing the connection." },
  { id: "S-4", title: "Increase tap target on mobile nav", category: "UX", impact: "Medium", description: "Hit areas under 44px detected on the burger menu. Apple HIG recommends 44×44 minimum." },
  { id: "S-5", title: "Implement Content-Security-Policy", category: "Security", impact: "High", description: "No CSP header detected. Recommend strict default-src 'self' with explicit allowlist." },
  { id: "S-6", title: "Add structured data for products", category: "SEO", impact: "Medium", description: "Product pages missing schema.org/Product. Enables rich results in Google search." },
];
