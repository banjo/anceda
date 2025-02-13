import { prisma } from "@/db";
import { createAdminApiInstance } from "@/server/api/api-instance";
import { createContextLogger } from "@/utils/context-logger";

const logger = createContextLogger("admin-controller");

export const adminController = createAdminApiInstance().get("/organizations", async c => {
    logger.info("Getting organizations");

    const orgs = await prisma.organization.findMany();

    return c.json({ organizations: orgs });
});
