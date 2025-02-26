import { Action, Resource } from "@/models/access-control";
import { createAuthorizedApiInstance } from "@/server/api/api-instance";
import { createResponseFromResult } from "@/server/api/controller-model";
import { organizationMiddleware } from "@/server/core/middleware/organization-middleware";
import { permissionMiddleware } from "@/server/core/middleware/permission-middleware";
import { OrganizationType } from "@/server/core/models/organization";
import { OrganizationService } from "@/server/core/services/organization-service";
import { createContextLogger } from "@/utils/context-logger";
import { sValidator } from "@hono/standard-validator";
import { z } from "zod";

const logger = createContextLogger("organization-controller");

export const organizationController = createAuthorizedApiInstance()
    .get("/:id", async c => {
        logger.info("Getting organizations request");
        const id = c.req.param("id");

        const res = await OrganizationService.get(id);
        return createResponseFromResult(res, c);
    })
    .post(
        "/secondary",
        permissionMiddleware(Resource.SECONDARY_ORGANIZATION, Action.CREATE),
        organizationMiddleware(OrganizationType.PRIMARY),
        sValidator("json", z.object({ name: z.string() })),
        async c => {
            logger.info("Creating organization request");
            const { organizationId } = c.get("user");
            const { name } = c.req.valid("json");

            const res = await OrganizationService.create({
                name,
                type: OrganizationType.SECONDARY,
                primaryOrganizationId: organizationId,
            });

            return createResponseFromResult(res, c);
        }
    );
