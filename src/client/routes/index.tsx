import { LoginContainer } from "@/client/components/containers/login-container";
import { useForceOverview } from "@/client/core/hooks/use-force-overview";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
    component: Index,
    // loader: async () => {
    //     await Promise.all([allAppsEnsureData, systemInformationEnsureData, authInfoEnsureData]);
    // },
});

function Index() {
    useForceOverview();

    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <LoginContainer />
        </div>
    );
}
