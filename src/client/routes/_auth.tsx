import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar } from "../components/shared/sidebar";
import { SidebarTrigger } from "../components/ui/sidebar";
import { useIsAuthRoute } from "../core/hooks/use-is-auth-route";

export const Route = createFileRoute("/_auth")({
    component: AuthLayout,
});

function AuthLayout() {
    useIsAuthRoute();

    return (
        <>
            <AppSidebar />
            <div className="w-full">
                <SidebarTrigger />
                <Outlet />
            </div>
        </>
    );
}
