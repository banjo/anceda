import { auth } from "@/server/auth";
import { User } from "@/server/core/models/user";
import { createLogger } from "@/utils/logger";
import { createMiddleware } from "hono/factory";

const logger = createLogger("auth-middleware");

export const authMiddleware = createMiddleware(async (c, next) => {
    logger.debug("Handling auth middleware");
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
        logger.debug("No session found");
        c.set("user", undefined);
        return next();
    }

    const user = User.fromHeaders(session.user, session.session);

    logger.debug("Added user to session", { user });
    c.set("user", user);
    return next();
});
