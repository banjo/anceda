import { prisma } from "../../../db";
import { createLogger } from "../../../utils/logger";
import { createAdminApiInstance } from "../api-instance";

const logger = createLogger("admin-controller");

// localhost:3000/api/admin/organizations
export const adminController = createAdminApiInstance().get("/organizations", async c => {
    logger.debug("Getting organizations");

    const orgs = await prisma.organization.findMany();

    return c.json({ organizations: orgs });
});
