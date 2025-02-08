import { AppSidebar } from "@/client/components/shared/sidebar";
import { SidebarTrigger } from "@/client/components/ui/sidebar";
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
            <div className="w-full">
                <SidebarTrigger />
                <Outlet />
            </div>
        </>
    );
}
