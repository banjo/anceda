import { Config } from "@/config";
import { api } from "@/server/api/api";
import { createPublicApiInstance } from "@/server/api/api-instance";
import { ErrorResponse, NotFoundResponse } from "@/server/api/controller-model";
import { auth } from "@/server/auth";
import { contextMiddleware } from "@/server/core/middleware/context-middleware";
import { contextStorage } from "hono/context-storage";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

export const app = createPublicApiInstance()
    .use(contextStorage())
    .use(contextMiddleware)
    .use(logger())
    .use(cors({ origin: Config.trustedOrigins, credentials: true }))
    .route("/api", api)
    .notFound(c => NotFoundResponse(c, { message: "Not found" }))
    .onError((err, c) => ErrorResponse(c, { message: err.message }));

app.on(["POST", "GET"], "/api/auth/**", c => auth.handler(c.req.raw));

export type AppType = typeof app;
