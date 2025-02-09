import { createRouter, RouterProvider } from "@tanstack/react-router";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./style.css";
import "./i18n/config.ts";
import { SidebarProvider } from "@/client/components/ui/sidebar";
import { AuthProvider, useAuth } from "@/client/core/providers/auth-provider";
import {
    FullScreenLoading,
    GlobalLoadingProvider,
} from "@/client/core/providers/global-loading-provider";
import { QueryProvider } from "@/client/core/providers/query-provider";
import { routeTree } from "@/client/routeTree.gen";

const router = createRouter({
    routeTree,
    context: {
        auth: undefined!,
    },
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

let isFirstLoad = true;

const InnerApp = () => {
    const auth = useAuth();

    if (auth.isPending && isFirstLoad) {
        return <FullScreenLoading isLoading text="Loading..." />;
    }

    isFirstLoad = false;
    return <RouterProvider router={router} context={{ auth }} />;
};

const App = () => (
    <AuthProvider>
        <QueryProvider>
            <GlobalLoadingProvider>
                <SidebarProvider>
                    <Toaster position="bottom-right" />
                    <InnerApp />
                </SidebarProvider>
            </GlobalLoadingProvider>
        </QueryProvider>
    </AuthProvider>
);

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
