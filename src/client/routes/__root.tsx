import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { AppSidebar } from "../components/shared/sidebar";
import { SidebarTrigger } from "../components/ui/sidebar";
import { useAuth } from "../core/providers/auth-provider";

const RootComponent = () => {
    // @ts-ignore - Vite injects the env, but Env does not work here for some reason
    const isDev = import.meta.env?.DEV ?? false;
    const { isAuthenticated } = useAuth();

    return (
        <>
            {isAuthenticated ? <AppSidebar /> : null}
            <main className="w-full">
                {isAuthenticated ? <SidebarTrigger /> : null}
                <Outlet />
            </main>
            {isDev ? <TanStackRouterDevtools /> : null}
        </>
    );
};

export const Route = createRootRoute({
    component: () => <RootComponent />,
    onError: (error: unknown) => {
        console.log("Error", error);
        throw redirect({ to: "/" });
    },
});
