import { Action, Resource } from "@/models/access-control";
import { ErrorResponse, UnauthorizedResponse } from "@/server/api/controller-model";
import { User } from "@/models/user";
import { PermissionService } from "@/service/permission-service";
import { createContextLogger } from "@/utils/context-logger";
import { Maybe } from "@banjoanton/utils";
import { createMiddleware } from "hono/factory";
import { ServerPermissionService } from "@/server/core/services/server-permission-service";

const logger = createContextLogger("collection-middleware");

export const collectionMiddleware = (collectionId: string, action: Action) =>
    createMiddleware(async (c, next) => {
        const user: Maybe<User> = c.get("user");

        if (!user) {
            logger.debug("No user found");
            return UnauthorizedResponse(c, { message: "Not authorized" });
        }

        const hasPermissionResult = await ServerPermissionService.hasCollectionAccess({
            user,
            collectionId,
            action,
        });

        if (!hasPermissionResult.ok) {
            logger.debug(
                { message: hasPermissionResult.message },
                "Error checking collectionb permission"
            );
            return ErrorResponse(c, { message: hasPermissionResult.message });
        }

        if (!hasPermissionResult.data) {
            logger.info(
                { action, collectionId },
                "User does not have permission for this action in collections"
            );
            return UnauthorizedResponse(c, {
                message: "User does not have permission for this action",
            });
        }

        return next();
    });
