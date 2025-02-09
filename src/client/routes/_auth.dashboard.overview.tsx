import { authClient } from "@/client/auth-client";
import { client } from "@/client/client";
import { Button } from "@/client/components/ui/button";
import { useAuth } from "@/client/core/providers/auth-provider";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/dashboard/overview")({
    component: DashboardOverview,
});

function DashboardOverview() {
    const auth = useAuth();

    const onLogout = async () => {
        await auth.signOut();
    };

    const onPermission = async () => {
        const { data, error } = await authClient.organization.hasPermission({
            permission: { organization: ["update"] },
        });

        console.log({ data, error });
    };

    const onAdmin = async () => {
        const res = await client.api.admin.organizations.$get();
        const data = await res.json();
        console.log({ data });
    };

    return (
        <div className="container mx-auto">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Anceda</h1>
            </header>

            <div className="flex gap-2">
                <Button onClick={onLogout}>Logout</Button>
                <Button onClick={onPermission}>Permission</Button>
                <Button onClick={onAdmin}>Admin</Button>
            </div>

            {auth.isAuthenticated ? `Signed in to ${auth.user.email}` : "Not signed in"}
        </div>
    );
}
