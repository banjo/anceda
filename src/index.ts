import { prisma } from "@/db";
import { app } from "@/server/app";
import { Env } from "@/utils/env";
import { createLogger } from "@/utils/logger";
import { isProduction } from "@/utils/runtime";
import { serve } from "@hono/node-server";
import closeWithGrace from "close-with-grace";

const env = Env.server();
export const port = env.PORT;
const logger = createLogger("index");

const main = async () => {
    logger.info(
        `🚀 Server is running in ${isProduction ? "production" : "development"} on http://localhost:${port}`
    );
    serve({
        fetch: app.fetch,
        port,
    });
};

closeWithGrace({ delay: 500 }, async ({ err }) => {
    logger.error({ error: err }, "☹️  Server is closing due to an error");
    await prisma.$disconnect();
});

main();
