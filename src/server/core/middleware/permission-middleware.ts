import { Action, Resource } from "@/models/access-control";
import { UnauthorizedResponse } from "@/server/api/controller-model";
import { User } from "@/models/user";
import { PermissionService } from "@/service/permission-service";
import { createContextLogger } from "@/utils/context-logger";
import { Maybe } from "@banjoanton/utils";
import { createMiddleware } from "hono/factory";

const logger = createContextLogger("permission-middleware");

export const permissionMiddleware = (resource: Resource, action: Action) =>
    createMiddleware(async (c, next) => {
        const user: Maybe<User> = c.get("user");

        if (!user) {
            logger.debug("No user found");
            return UnauthorizedResponse(c, { message: "Not authorized" });
        }

        const hasPermission = PermissionService.userHasPermission(user, resource, action);

        if (!hasPermission) {
            logger.info({ action, resource }, "User does not have permission for this action");
            return UnauthorizedResponse(c, {
                message: "User does not have permission for this action",
            });
        }

        return next();
    });
