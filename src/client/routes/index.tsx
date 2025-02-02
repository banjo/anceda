import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../components/ui/button";
import { authClient } from "../auth-client";

const Index = () => {
    const onClick = async () => {
        const { data, error } = await authClient.signUp.email({
            email: "test@example.com",
            password: "password1234",
            name: "test",
            image: "https://example.com/image.png",
        });

        console.log({ data, error });
    };

    const onLogin = async () => {
        const { data, error } = await authClient.signIn.email({
            email: "test@example.com",
            password: "password1234",
        });

        console.log({ data, error });
    };

    const onLogout = async () => {
        const { data, error } = await authClient.signOut();

        console.log({ data, error });
    };

    const { data: session, isPending, error } = authClient.useSession();

    console.log({ session, isPending, error });
    return (
        <div className="container mx-auto p-4">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Anceda</h1>
            </header>

            <div className="flex gap-2">
                <Button onClick={onClick}>Create</Button>
                <Button onClick={onLogin}>Login</Button>
                <Button onClick={onLogout}>Logout</Button>
            </div>

            {session?.user?.email ? `Signed in to ${session?.user?.email}` : "Not signed in"}
        </div>
    );
};

export const Route = createFileRoute("/")({
    component: Index,
    // loader: async () => {
    //     await Promise.all([allAppsEnsureData, systemInformationEnsureData, authInfoEnsureData]);
    // },
});
