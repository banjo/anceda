import { AppSidebar } from "@/client/components/shared/sidebar/sidebar";
import { SidebarSibling } from "@/client/components/shared/sidebar/sidebar-sibling";
import { useIsAuthRoute } from "@/client/core/hooks/use-is-auth-route";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
    component: AuthLayout,
});

function AuthLayout() {
    useIsAuthRoute();

    return (
        <>
            <AppSidebar />
            <SidebarSibling>
                <Outlet />
            </SidebarSibling>
        </>
    );
}
