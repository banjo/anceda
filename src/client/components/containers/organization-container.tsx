import { useMyOrganizationQuery } from "@/client/queries/my-organization-query";

export const OrganizationContainer = () => {
    const { data, isPending, error } = useMyOrganizationQuery();

    if (isPending) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h1>Organization</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};
