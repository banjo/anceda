import { auth } from "@/server/auth";
import { User } from "@/server/core/models/user";
import { createContextLogger } from "@/utils/context-logger";
import { uuid } from "@banjoanton/utils";
import { createMiddleware } from "hono/factory";

const logger = createContextLogger("auth-middleware");

export const authMiddleware = createMiddleware(async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    const requestId = uuid();
    c.set("requestId", requestId);

    if (!session) {
        logger.debug("No session found");
        c.set("user", undefined);
        return next();
    }

    const user = User.fromHeaders(session.user, session.session);

    c.set("user", user);
    return next();
});
