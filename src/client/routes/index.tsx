import { createFileRoute, redirect } from "@tanstack/react-router";
import { Button } from "../components/ui/button";
import { useAuthActions } from "../core/hooks/use-auth-actions";
import { useAuth } from "../core/providers/auth-provider";

const Index = () => {
    const auth = useAuth();
    const { signIn } = useAuthActions();

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
};

export const Route = createFileRoute("/")({
    component: Index,
    beforeLoad: async ({ context }) => {
        console.log("index", { context });
        if (context.auth.isAuthenticated) {
            throw redirect({
                to: "/dashboard",
            });
        }
    },
    // loader: async () => {
    //     await Promise.all([allAppsEnsureData, systemInformationEnsureData, authInfoEnsureData]);
    // },
});
