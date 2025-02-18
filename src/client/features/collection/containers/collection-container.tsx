import { useParams } from "@tanstack/react-router";

export const CollectionContainer = () => {
    const parmas = useParams({ strict: false });

    return <div>Collection with id: {parmas.collectionId}</div>;
};
