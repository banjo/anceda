import { createMiddleware } from "hono/factory";
import { createLogger } from "../../../utils/logger";
import { auth } from "../../auth";
import { User } from "../models/user";

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
