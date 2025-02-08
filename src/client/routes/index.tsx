import { LoginContainer } from "@/client/components/containers/login-container";
import { useForceDashboardIfAuth } from "@/client/core/hooks/use-force-dashboard";
import { createFileRoute } from "@tanstack/react-router";

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
            <LoginContainer />
        </div>
    );
}
