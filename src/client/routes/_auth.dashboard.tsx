import { PageContainer } from "@/client/components/shared/page-container";
import { useForceDashboardIfAuth } from "@/client/core/hooks/use-force-dashboard";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/dashboard")({
    component: Dashboard,
});

function Dashboard() {
    useForceDashboardIfAuth();
    return (
        <PageContainer>
            <Outlet />
        </PageContainer>
    );
}
