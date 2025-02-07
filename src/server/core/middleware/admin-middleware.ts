import { createMiddleware } from "hono/factory";
import { createLogger } from "../../../utils/logger";
import { UnauthorizedResponse } from "../../api/controller-model";

const logger = createLogger("admin-middleware");

export const adminMiddleware = createMiddleware(async (c, next) => {
    logger.debug("Handling admin middleware");
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
