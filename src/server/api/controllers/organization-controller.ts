import { Action, Resource } from "@/models/access-control";
import { createAuthorizedApiInstance } from "@/server/api/api-instance";
import {
    createResponseFromResult,
    createResponseFromVoidResult,
} from "@/server/api/controller-model";
import { organizationMiddleware } from "@/server/core/middleware/organization-middleware";
import { permissionMiddleware } from "@/server/core/middleware/permission-middleware";
import { OrganizationType } from "@/models/organization";
import { OrganizationService } from "@/server/core/services/organization-service";
import { createContextLogger } from "@/utils/context-logger";
import { sValidator } from "@hono/standard-validator";
import { z } from "zod";
import { OrganizationRole } from "@/models/role";
import { InviteUserSchema } from "@/server/api/models/invite-user-schema";

const logger = createContextLogger("organization-controller");

export const organizationController = createAuthorizedApiInstance()
    .get("/mine", async c => {
        logger.debug("Getting my organizations request");
        const { organizationId } = c.get("user");

        const res = await OrganizationService.get(organizationId);
        return createResponseFromResult(c, res);
    })
    .get("/details/:id", async c => {
        logger.debug("Getting organizations request");
        const id = c.req.param("id");

        // TODO: what should the permissions be here?
        const res = await OrganizationService.get(id);
        return createResponseFromResult(c, res);
    })
    .post(
        "/secondary/create",
        permissionMiddleware(Resource.SECONDARY_ORGANIZATION, Action.CREATE),
        organizationMiddleware(OrganizationType.PRIMARY),
        sValidator("json", z.object({ name: z.string() })),
        async c => {
            logger.debug("Creating organization request");
            const { organizationId } = c.get("user");
            const { name } = c.req.valid("json");

            const res = await OrganizationService.create({
                name,
                type: OrganizationType.SECONDARY,
                primaryOrganizationId: organizationId,
            });

            return createResponseFromResult(c, res);
        }
    )
    .post(
        "/secondary/invite",
        permissionMiddleware(Resource.SECONDARY_ORGANIZATION, Action.CREATE),
        organizationMiddleware(OrganizationType.PRIMARY),
        sValidator("json", z.object({ organizationId: z.string(), email: z.string() })),
        async c => {
            logger.debug("Inviting user to secondary organization request");
            const { id } = c.get("user");
            const { organizationId, email } = c.req.valid("json");

            const res = await OrganizationService.inviteUserToOrganization({
                email,
                organizationId,
                inviterId: id,
                role: OrganizationRole.SECONDARY_OWNER,
            });

            return createResponseFromVoidResult(c, res);
        }
    )
    .post(
        "/invite",
        permissionMiddleware(Resource.INVITE_MEMBER, Action.CREATE),
        sValidator("json", InviteUserSchema),
        async c => {
            logger.debug("Inviting user to organization request");
            const { id, organizationId } = c.get("user");
            const { email, role } = c.req.valid("json");

            const res = await OrganizationService.inviteUserToOrganization({
                email,
                organizationId,
                inviterId: id,
                role,
            });

            return createResponseFromVoidResult(c, res);
        }
    );
