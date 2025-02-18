import { createFileRoute, Outlet, useParams } from "@tanstack/react-router";
// import { useAuth } from "@/client/core/providers/auth-provider";
import { CollectionsContainer } from "../features/collections/containers/collections-container";

export const Route = createFileRoute("/_auth/dashboard/collections")({
    component: CollectionsComponent,
});

function CollectionsComponent() {
    // const auth = useAuth();
    const params = useParams({ strict: false });
    return params.collectionId ? <Outlet /> : <CollectionsContainer />;
}
