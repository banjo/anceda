import { uuid } from "@banjoanton/utils";
import { createMiddleware } from "hono/factory";

export const contextMiddleware = createMiddleware(async (c, next) => {
    const requestId = uuid();
    c.set("requestId", requestId);
    return next();
});
