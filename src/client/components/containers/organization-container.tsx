import { MyOrganizationQuery } from "@/client/queries/my-organization-query";

export const OrganizationContainer = () => {
    const { data } = MyOrganizationQuery.suspenseQuery();

    return (
        <div className="w-full">
            <h1>Organization</h1>
            {data.name}
        </div>
    );
};
