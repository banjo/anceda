import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "../components/ui/button";
import { useAuthActions } from "../core/hooks/use-auth-actions";
import { useAuth } from "../core/providers/auth-provider";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
    component: Index,
    // loader: async () => {
    //     await Promise.all([allAppsEnsureData, systemInformationEnsureData, authInfoEnsureData]);
    // },
});

function Index() {
    const auth = useAuth();
    const navigate = useNavigate();
    const { signIn } = useAuthActions();

    useEffect(() => {
        if (!auth.isPending && auth.isAuthenticated) {
            navigate({ to: "/dashboard" });
        }
    }, [auth, navigate]);

    const onLogin = async () => {
        await signIn({
            email: "test@test.com",
            password: "123qweASD",
        });
    };

    return (
        <div className="container mx-auto p-4">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Anceda</h1>
            </header>

            <div className="flex gap-2">
                <Button onClick={onLogin}>Login</Button>
            </div>

            {auth.isAuthenticated ? `Signed in to ${auth.user.email}` : "Not signed in"}
        </div>
    );
}
