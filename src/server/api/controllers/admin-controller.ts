import { createAdminApiInstance } from "@/server/api/api-instance";
import { ErrorResponse, SuccessResponse } from "@/server/api/controller-model";
import { AdminService } from "@/server/core/services/admin-service";
import { createContextLogger } from "@/utils/context-logger";

const logger = createContextLogger("admin-controller");

export const adminController = createAdminApiInstance().get("/organizations", async c => {
    logger.info("Getting organizations");

    const res = await AdminService.getAllOrganizations();

    if (!res.ok) {
        logger.error({ message: res.message }, "Failed to get organizations");
        return ErrorResponse(c, { message: res.message });
    }

    return SuccessResponse(c, res.data);
});
