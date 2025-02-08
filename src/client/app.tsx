import { createRouter, RouterProvider } from "@tanstack/react-router";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { QueryProvider } from "./core/providers/query-provider";
import "./style.css";

import { SidebarProvider } from "./components/ui/sidebar";
import { AuthProvider, useAuth } from "./core/providers/auth-provider";
import { GlobalLoadingProvider } from "./core/providers/global-loading-provider";
import { routeTree } from "./routeTree.gen";

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
    const session = useAuth();

    if (session.isPending && isFirstLoad) {
        return <div>Loading...</div>;
    }

    isFirstLoad = false;
    return <RouterProvider router={router} context={{ auth: session }} />;
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
