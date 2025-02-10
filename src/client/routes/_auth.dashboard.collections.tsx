import { createFileRoute } from "@tanstack/react-router";
// import { useAuth } from "@/client/core/providers/auth-provider";
import { CollectionsContainer } from "../features/collections/containers/collections-container";

export const Route = createFileRoute("/_auth/dashboard/collections")({
    component: CollectionsComponent,
});

function CollectionsComponent() {
    // const auth = useAuth();

    return <CollectionsContainer />;
}
