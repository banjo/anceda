import { createQuery } from "@/client/core/utils/query-creator";
import { client } from "../client";
import { FetchService } from "../core/services/fetch-service";

export const MyOrganizationQuery = createQuery({
    keyFn: () => ["organization", "mine"],
    queryFn: async () => await FetchService.queryByClient(client.api.organization.mine.$get),
});
