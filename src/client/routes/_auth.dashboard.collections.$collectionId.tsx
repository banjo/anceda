import { createFileRoute } from "@tanstack/react-router";
import { CollectionContainer } from "@/client/features/collection/containers/collection-container";

export const Route = createFileRoute("/_auth/dashboard/collections/$collectionId")({
    component: CollectionComponent,
});

function CollectionComponent() {
    return <CollectionContainer />;
}
