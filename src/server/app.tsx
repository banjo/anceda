import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { renderToString } from "react-dom/server";
import { isProduction } from "../utils/runtime";
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
    .use(cors({ origin: "http://localhost:5173", credentials: true }))
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

app.use(
    "/assets/*",
    serveStatic({
        rewriteRequestPath: path => `./dist${path}`,
    })
);

if (isProduction) {
    app.get("*", c =>
        c.html(
            renderToString(
                <html>
                    <head>
                        <meta charSet="utf-8" />
                        <meta content="width=device-width, initial-scale=1" name="viewport" />
                        <title>Anceda</title>
                        <script type="module" src="/assets/client.js" />
                        <link rel="stylesheet" href="/assets/style.css" />
                    </head>
                    <body>
                        <div id="root" />
                    </body>
                </html>
            )
        )
    );
}

export type AppType = typeof app;
