import { queryOptions } from "@tanstack/react-query";
import { client } from "../client";
import { FetchService } from "../core/services/fetch-service";
import { queryClient } from "../core/providers/query-provider";

export const authInfoQueryKey = ["auth-info"];

export const authInfoQueryOptions = queryOptions({
    queryKey: authInfoQueryKey,
    queryFn: async () => await FetchService.queryByClient(client.api.server.auth.$get),
});

export const authInfoEnsureData = async () =>
    await queryClient.ensureQueryData(authInfoQueryOptions);
