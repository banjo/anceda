import { prisma } from "@/db";
import { Organization } from "@/models/organization";
import { ORGANIZATION_INCLUDE_CLAUSE } from "@/server/core/models/prisma";
import { OrganizationRole, parseOrganizationRole } from "@/models/role";
import { createContextLogger } from "@/utils/context-logger";
import { AsyncResultType, Result } from "@/utils/result";
import { to } from "@banjoanton/utils";

const logger = createContextLogger("user-service");

const getActiveOrganization = async (
    userId: string
): AsyncResultType<Organization & { role: OrganizationRole }> => {
    logger.info({ id: userId }, "Getting organization for user");

    const [error, memberResult] = await to(async () =>
        prisma.member.findFirst({
            where: { userId: { equals: userId } },
            select: { organizationId: true, role: true },
        })
    );

    if (error) {
        logger.error({ error }, "Failed to get member in organization");
        return Result.error(error.message, "INTERNAL_SERVER_ERROR");
    }

    if (!memberResult) {
        logger.error({ id: userId }, "Organization for user not found");
        return Result.error("Organization for user not found", "NOT_FOUND");
    }

    const [orgError, organization] = await to(() =>
        prisma.organization.findUnique({
            where: { id: memberResult.organizationId },
            include: ORGANIZATION_INCLUDE_CLAUSE.FULL,
        })
    );

    if (orgError) {
        logger.error({ error: orgError }, "Failed to get organization");
        return Result.error(orgError.message, "INTERNAL_SERVER_ERROR");
    }

    if (!organization) {
        logger.error({ id: memberResult.organizationId }, "Organization not found");
        return Result.error("Organization not found", "NOT_FOUND");
    }

    logger.info({ id: memberResult.organizationId }, "Organization for user found");
    const org = Organization.fromDb(organization);
    const orgWithRole = { ...org, role: parseOrganizationRole(memberResult.role) };

    return Result.ok(orgWithRole);
};

export const UserService = { getActiveOrganization };
