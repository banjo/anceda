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

    const onAdmin = async () => {
        const res = await client.api.admin.organizations.$get();
        const data = await res.json();
        console.log({ data });
    };

    const onCreateSecondary = async () => {
        const res = await client.api.organization.secondary.$post({ json: { name: "test" } });
        const data = await res.json();
        console.log({ data });
    };

    const onInviteToSecondary = async () => {
        const res = await client.api.organization.secondary.invite.$post({
            json: { email: "daver@tjenare.com", organizationId: auth.user?.organizationId ?? "" },
        });
        const data = await res.json();
        console.log({ data });
    };

    const onAcceptInvite = async () => {
        const res = await client.api.public.invite.accept.$post({
            json: { token: "cm7mcb7ai0003sf2djzpayp89" },
        });
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
                <Button onClick={onAdmin}>Admin</Button>
                <Button onClick={onCreateSecondary}>Create secondary</Button>
                <Button onClick={onInviteToSecondary}>Invite to secondary</Button>
                <Button onClick={onAcceptInvite}>Accept invite</Button>
            </div>

            {auth.isAuthenticated ? `Signed in to ${auth.user.email}` : "Not signed in"}
        </div>
    );
}
