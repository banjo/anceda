import { createAuthorizedApiInstance } from "@/server/api/api-instance";
import { createResponseFromResult } from "@/server/api/controller-model";
import { OrganizationService } from "@/server/core/services/organization-service";
import { createContextLogger } from "@/utils/context-logger";

const logger = createContextLogger("organization-controller");

export const organizationController = createAuthorizedApiInstance().get("/:id", async c => {
    logger.info("Getting organizations request");
    const id = c.req.param("id");

    const res = await OrganizationService.get(id);
    return createResponseFromResult(res, c);
});
