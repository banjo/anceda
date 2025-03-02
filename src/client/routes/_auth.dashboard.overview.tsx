import { client } from "@/client/client";
import { OrganizationContainer } from "@/client/components/containers/organization-container";
import { Button } from "@/client/components/ui/button";
import { useAuth } from "@/client/core/providers/auth-provider";
import { FetchService } from "@/client/core/services/fetch-service";
import { Toast } from "@/client/core/utils/toast";
import { useMutation } from "@tanstack/react-query";
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
        const [error, data] = await FetchService.queryWithErrorHandling(
            client.api.admin.organizations.$get
        );

        if (error) {
            console.error(error);
            return;
        }
        console.log({ data });
        Toast.success("Success message :)");
    };

    const createSecondaryMutation = useMutation({
        mutationFn: async () =>
            FetchService.queryByClient(() =>
                client.api.organization.secondary.$post({ json: { name: "test" } })
            ),
        onSuccess: data => {
            console.log({ data });
        },
    });

    const inviteToSecondaryMutation = useMutation({
        mutationFn: async () =>
            FetchService.queryByClient(() =>
                client.api.organization.secondary.invite.$post({
                    json: {
                        email: "daver@tjenare.com",
                        organizationId: auth.user?.organizationId ?? "",
                    },
                })
            ),
        onSuccess: data => {
            console.log({ data });
        },
    });

    const onAcceptMutation = useMutation({
        mutationFn: async () =>
            FetchService.queryByClient(() =>
                client.api.public.invite.accept.$post({
                    json: { token: "" },
                })
            ),
        onSuccess: data => {
            console.log({ data });
        },
    });

    return (
        <div className="container mx-auto">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Anceda</h1>
            </header>

            <div className="flex gap-2">
                <Button onClick={onLogout}>Logout</Button>
                <Button onClick={onAdmin}>Admin</Button>
                <Button onClick={() => createSecondaryMutation.mutate()}>Create secondary</Button>
                <Button onClick={() => inviteToSecondaryMutation.mutate()}>
                    Invite to secondary
                </Button>
                <Button onClick={() => onAcceptMutation.mutate()}>Accept invite</Button>
            </div>

            {auth.isAuthenticated ? `Signed in to ${auth.user.email}` : "Not signed in"}

            <div>
                <OrganizationContainer />
            </div>
        </div>
    );
}
