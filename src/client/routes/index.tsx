import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../components/ui/button";

const Index = () => (
    <div className="container mx-auto p-4">
        <header className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Anceda</h1>
            <Button asChild>Hej</Button>
        </header>
    </div>
);

export const Route = createFileRoute("/")({
    component: Index,
    // loader: async () => {
    //     await Promise.all([allAppsEnsureData, systemInformationEnsureData, authInfoEnsureData]);
    // },
});
