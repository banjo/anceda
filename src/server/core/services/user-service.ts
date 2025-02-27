import { defaultDbOptions, prisma, PrismaTransactionalClient } from "@/db";
import { Organization } from "@/models/organization";
import { ORGANIZATION_INCLUDE_CLAUSE } from "@/server/core/models/prisma";
import { OrganizationRole, parseOrganizationRole, UserRole } from "@/models/role";
import { createContextLogger } from "@/utils/context-logger";
import { AsyncResultType, Result } from "@/utils/result";
import { to, uuid, wrapAsync } from "@banjoanton/utils";
import { auth } from "@/server/auth";

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

type CreateUserProps = {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    emailVerified?: boolean;
};
const create = async (
    { email, password, name, role = UserRole.USER, emailVerified = false }: CreateUserProps,
    { prisma } = defaultDbOptions
) => {
    const [createUserError, createdUser] = await to(() =>
        prisma.user.create({
            data: {
                email,
                name,
                role,
                emailVerified,
            },
        })
    );

    if (createUserError) {
        logger.error({ error: createUserError }, "Failed to accept invite");
        return Result.error(createUserError.message, "INTERNAL_SERVER_ERROR");
    }

    const ctx = await auth.$context;
    const hashedPassword = await ctx.password.hash(password);

    const [accountError] = await to(() =>
        prisma.account.create({
            data: {
                accountId: uuid(), // TODO: check if this is correct?
                providerId: "credential",
                password: hashedPassword,
                user: {
                    connect: {
                        id: createdUser.id,
                    },
                },
            },
        })
    );

    if (accountError) {
        logger.error({ error: accountError }, "Failed to create account");
        return Result.error(accountError.message, "INTERNAL_SERVER_ERROR");
    }

    return Result.ok(createdUser);
};

export const UserService = { getActiveOrganization, create };
