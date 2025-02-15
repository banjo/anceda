import { createAdminApiInstance } from "@/server/api/api-instance";
import { createResponseFromResult } from "@/server/api/controller-model";
import { AdminService } from "@/server/core/services/admin-service";
import { createContextLogger } from "@/utils/context-logger";

const logger = createContextLogger("admin-controller");

export const adminController = createAdminApiInstance().get("/organizations", async c => {
    logger.info("Getting organizations");

    const res = await AdminService.getAllOrganizations();

    return createResponseFromResult(res, c);
});
