import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
    component: DashboardLayout,
    beforeLoad: async ({ context }) => {
        console.log("db layout", { context });
        if (!context.auth.isAuthenticated) {
            throw redirect({ to: "/" });
        }
    },
});

function DashboardLayout() {
    return <Outlet />;
}
