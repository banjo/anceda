import { createAdminApiInstance } from "@/server/api/api-instance";
import { ErrorResponse, SuccessResponse } from "@/server/api/controller-model";
import { AdminService } from "@/server/core/services/admin-service";
import { createContextLogger } from "@/utils/context-logger";

const logger = createContextLogger("admin-controller");

export const adminController = createAdminApiInstance().get("/organizations", async c => {
    logger.info("Getting organizations");

    const [error, orgs] = await AdminService.getAllOrganizations();

    if (error) {
        logger.error({ error }, "Error getting organizations");
        return ErrorResponse(c, error);
    }

    return SuccessResponse(c, orgs);
});
