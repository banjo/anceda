import { createAdminApiInstance } from "@/server/api/api-instance";
import { createResponseFromResult } from "@/server/api/controller-model";
import { CreateOrganizationSchema } from "@/server/api/models/create-organization-schema";
import { AdminService } from "@/server/core/services/admin-service";
import { OrganizationService } from "@/server/core/services/organization-service";
import { createContextLogger } from "@/utils/context-logger";
import { sValidator } from "@hono/standard-validator";

const logger = createContextLogger("admin-controller");

export const adminController = createAdminApiInstance()
    .get("/organizations", async c => {
        logger.info("Getting organizations request");

        const res = await AdminService.getAllOrganizations();
        return createResponseFromResult(res, c);
    })
    .post("/organisation", sValidator("json", CreateOrganizationSchema), async c => {
        const { name } = c.req.valid("json");
        logger.info({ name }, "Creating organization request");

        const res = await OrganizationService.create({ name, type: "PRIMARY" });
        return createResponseFromResult(res, c);
    });
