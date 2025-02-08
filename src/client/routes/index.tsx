import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../components/ui/button";
import { useAuthActions } from "../core/hooks/use-auth-actions";
import { useForceDashboardIfAuth } from "../core/hooks/use-force-dashboard";
import { useAuth } from "../core/providers/auth-provider";
import { LoginForm } from "../components/containers/login-container";

export const Route = createFileRoute("/")({
    component: Index,
    // loader: async () => {
    //     await Promise.all([allAppsEnsureData, systemInformationEnsureData, authInfoEnsureData]);
    // },
});

function Index() {
    useForceDashboardIfAuth();

    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <LoginForm />
        </div>
    );
}
