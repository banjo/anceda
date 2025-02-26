import { UnauthorizedResponse } from "@/server/api/controller-model";
import { User } from "@/server/core/models/user";
import { createContextLogger } from "@/utils/context-logger";
import { Maybe } from "@banjoanton/utils";
import { OrganizationType } from "@prisma/client";
import { createMiddleware } from "hono/factory";

const logger = createContextLogger("organization-middleware");

export const organizationMiddleware = (expectedType: OrganizationType) =>
    createMiddleware(async (c, next) => {
        const user: Maybe<User> = c.get("user");

        if (!user) {
            logger.debug("No user found");
            return UnauthorizedResponse(c, { message: "Not authorized" });
        }

        if (user.organizationType !== expectedType) {
            logger.info(
                {
                    userOrganizationType: user.organizationType,
                    requiredOrganizationType: expectedType,
                },
                "Organization type is correct for this action"
            );
            return UnauthorizedResponse(c, {
                message: "User does not have permission for this action",
            });
        }

        return next();
    });
