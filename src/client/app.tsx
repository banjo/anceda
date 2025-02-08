import { createRouter, RouterProvider } from "@tanstack/react-router";
import { createRoot } from "react-dom/client";
import { QueryProvider } from "./core/providers/query-provider";
import "./style.css";
import { Toaster } from "react-hot-toast";

import { routeTree } from "./routeTree.gen";
import { SidebarProvider } from "./components/ui/sidebar";
import { GlobalLoadingProvider } from "./core/providers/global-loading-provider";
import { AuthProvider } from "./core/providers/auth-provider";
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

const App = () => (
    <AuthProvider>
        <QueryProvider>
            <GlobalLoadingProvider>
                <SidebarProvider>
                    <Toaster position="bottom-right" />
                    <RouterProvider router={router} />
                </SidebarProvider>
            </GlobalLoadingProvider>
        </QueryProvider>
    </AuthProvider>
);

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
