import { createRootRouteWithContext, Outlet, redirect } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { AuthData } from "../core/providers/auth-provider";

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
    onError: (error: unknown) => {
        console.log("Error", error);
        throw redirect({ to: "/" });
    },
});
