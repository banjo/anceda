import { Config } from "@/config";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { api } from "./api/api";
import { createPublicApiInstance } from "./api/api-instance";
import { NotFoundResponse } from "./api/controller-model";
import { auth } from "./auth";

export const app = createPublicApiInstance()
    .use(logger())
    .use(cors({ origin: Config.trustedOrigins, credentials: true }))
    .route("/api", api)
    .notFound(c => NotFoundResponse(c, { message: "Not found" }));

app.on(["POST", "GET"], "/api/auth/**", c => auth.handler(c.req.raw));

export type AppType = typeof app;
