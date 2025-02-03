import { Config } from "@/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { api } from "./api/api";
import { NotFoundResponse, SuccessResponse } from "./api/controller-model";
import { auth } from "./auth";

type HonoApp = {
    Variables: {
        user: typeof auth.$Infer.Session.user | null;
        session: typeof auth.$Infer.Session.session | null;
    };
};

export const app = new Hono<HonoApp>()
    .use(cors({ origin: Config.trustedOrigins, credentials: true }))
    .route("/api", api)
    .notFound(c => NotFoundResponse(c, { message: "Not found" }));

app.use(logger());

app.use("*", async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
        c.set("user", null);
        c.set("session", null);
        return next();
    }

    c.set("user", session.user);
    c.set("session", session.session);
    return next();
});

app.on(["POST", "GET"], "/api/auth/**", c => auth.handler(c.req.raw));

app.get("/path", async c => {
    console.log(c.get("session"));
    return SuccessResponse(c, { message: "Success" });
});

export type AppType = typeof app;
