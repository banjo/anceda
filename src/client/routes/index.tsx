import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../components/ui/button";
import { authClient } from "../auth-client";
import { client } from "../client";
import { useAuth } from "../core/providers/auth-provider";

const Index = () => {
    const auth = useAuth();

    const onLogin = async () => {
        await auth.signIn({
            email: "test@test.com",
            password: "123qweASD",
        });
    };

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
        <div className="container mx-auto p-4">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Anceda</h1>
            </header>

            <div className="flex gap-2">
                <Button onClick={onLogin}>Login</Button>
                <Button onClick={onLogout}>Logout</Button>
                <Button onClick={onPermission}>Permission</Button>
                <Button onClick={onAdmin}>Admin</Button>
            </div>

            {auth.isAuthenticated ? `Signed in to ${auth.user.email}` : "Not signed in"}
        </div>
    );
};

export const Route = createFileRoute("/")({
    component: Index,
    // loader: async () => {
    //     await Promise.all([allAppsEnsureData, systemInformationEnsureData, authInfoEnsureData]);
    // },
});
