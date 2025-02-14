import { prisma } from "@/db";
import { Organization } from "@/server/core/models/organization";
import { createContextLogger } from "@/utils/context-logger";
import { Result } from "@/utils/result";
import { to } from "@banjoanton/utils";

const logger = createContextLogger("admin-controller");

const getAllOrganizations = async () => {
    const [error, orgs] = await to(() => prisma.organization.findMany());

    if (error) {
        logger.error({ error }, "Failed to get organizations");
        return Result.error(error.message, "INTERNAL_SERVER_ERROR");
    }

    const organizations = orgs.map(Organization.fromDb);

    return Result.ok(organizations);
};

export const AdminService = { getAllOrganizations };
