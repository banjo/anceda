import { ApiFullSession, auth } from "@/server/auth";
import { User } from "@/server/core/models/user";
import { createContextLogger } from "@/utils/context-logger";
import { uuid } from "@banjoanton/utils";
import { createMiddleware } from "hono/factory";

const logger = createContextLogger("auth-middleware");

export const authMiddleware = createMiddleware(async (c, next) => {
    const session = (await auth.api.getSession({
        headers: c.req.raw.headers,
    })) as unknown as ApiFullSession | null; // bug in better-auth types, correct type not inferred

    const requestId = uuid();
    c.set("requestId", requestId);

    if (!session) {
        logger.debug("No session found");
        c.set("user", undefined);
        return next();
    }

    const user = User.fromApiSession(session);

    c.set("user", user);
    return next();
});
