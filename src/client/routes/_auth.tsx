import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { AppSidebar } from "../components/shared/sidebar";
import { SidebarTrigger } from "../components/ui/sidebar";
import { useAuth } from "../core/providers/auth-provider";
import { useEffect } from "react";

export const Route = createFileRoute("/_auth")({
    component: AuthLayout,
});

function AuthLayout() {
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.isPending && !auth.isAuthenticated) {
            navigate({ to: "/" });
        }
    }, [auth, navigate]);

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
