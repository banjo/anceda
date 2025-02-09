import { PageContainer } from "@/client/components/shared/page-container";
import { useForceOverview } from "@/client/core/hooks/use-force-overview";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/dashboard")({
    component: Dashboard,
});

function Dashboard() {
    useForceOverview();
    return (
        <PageContainer>
            <Outlet />
        </PageContainer>
    );
}
