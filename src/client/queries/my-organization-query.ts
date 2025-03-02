import { queryOptions, useQuery } from "@tanstack/react-query";
import { client } from "../client";
import { FetchService } from "../core/services/fetch-service";
import { queryClient } from "../core/providers/query-provider";

export const myOrganizationQueryKey = ["organization", "mine"];

export const MyOrganizationQueryOptions = queryOptions({
    queryKey: myOrganizationQueryKey,
    queryFn: async () => await FetchService.queryByClient(client.api.organization.mine.$get),
});

export const MyOrganizationEnsureData = async () =>
    await queryClient.ensureQueryData(MyOrganizationQueryOptions);

export const useMyOrganizationQuery = () => useQuery(MyOrganizationQueryOptions);
