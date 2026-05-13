import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopbar } from "@/components/dashboard/topbar";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
  head: () => ({ meta: [{ title: "Dashboard — Protoscan.ai" }] }),
});

const TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/new-scan": "New Scan",
  "/dashboard/reports": "Reports",
  "/dashboard/failures": "Failures",
  "/dashboard/ai-suggestions": "AI Suggestions",
  "/dashboard/billing": "Billing",
  "/dashboard/settings": "Settings",
};

function DashboardLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  let title = TITLES[path] ?? "Reports";
  if (path.startsWith("/dashboard/reports/") && path !== "/dashboard/reports") title = "Report Detail";

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopbar title={title} />
        <main className="flex-1 p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
