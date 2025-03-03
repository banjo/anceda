import { FullScreenError } from "@/client/components/shared/error";
import { AuthData } from "@/client/core/providers/auth-provider";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

type RouterContext = {
    auth: AuthData;
};

const RootComponent = () => {
    // @ts-ignore - Vite injects the env, but Env does not work here for some reason
    const isDev = import.meta.env?.DEV ?? false;

    return (
        <>
            <Outlet />
            {isDev ? <TanStackRouterDevtools /> : null}
        </>
    );
};

export const Route = createRootRouteWithContext<RouterContext>()({
    component: () => <RootComponent />,
    errorComponent: ({ error }) => <FullScreenError error={error} />,
});
