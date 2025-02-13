import { UnauthorizedResponse } from "@/server/api/controller-model";
import { createContextLogger } from "@/utils/context-logger";
import { createMiddleware } from "hono/factory";

const logger = createContextLogger("admin-middleware");

export const adminMiddleware = createMiddleware(async (c, next) => {
    const user = c.get("user");

    if (!user) {
        logger.debug("No user found");
        return UnauthorizedResponse(c, { message: "Not authorized" });
    }

    if (!user.isAdmin) {
        logger.debug("User is not admin");
        return UnauthorizedResponse(c, { message: "Not admin" });
    }

    return next();
});
