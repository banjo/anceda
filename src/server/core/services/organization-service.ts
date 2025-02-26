import { prisma } from "@/db";
import { CreateOrganizationType } from "@/server/api/models/create-organization-schema";
import { Organization } from "@/models/organization";
import { ORGANIZATION_INCLUDE_CLAUSE } from "@/server/core/models/prisma";
import { createContextLogger } from "@/utils/context-logger";
import { AsyncResultType, Result } from "@/utils/result";
import { to, uuid } from "@banjoanton/utils";

const logger = createContextLogger("organization-service");

const create = async (props: CreateOrganizationType): AsyncResultType<Organization> => {
    logger.info({ name: props.name }, "Creating organization");
    const baseSlug = props.name.toLowerCase().replace(/ /g, "-");
    const uniqueSlug = `${baseSlug}-${uuid()}`;

    const [error, organization] = await to(() =>
        prisma.organization.create({
            data: { ...props, slug: uniqueSlug },
            include: ORGANIZATION_INCLUDE_CLAUSE.FULL,
        })
    );

    if (error) {
        logger.error({ error }, "Failed to create organization");
        return Result.error(error.message, "INTERNAL_SERVER_ERROR");
    }

    logger.info({ name: props.name }, "Organization created");
    const org = Organization.fromDb(organization);
    return Result.ok(org);
};

const get = async (id: string): AsyncResultType<Organization> => {
    logger.info({ id }, "Getting organization");
    const [error, organization] = await to(() =>
        prisma.organization.findUnique({
            where: { id },
            include: ORGANIZATION_INCLUDE_CLAUSE.FULL,
        })
    );

    if (error) {
        logger.error({ error }, "Failed to get organization");
        return Result.error(error.message, "INTERNAL_SERVER_ERROR");
    }

    if (!organization) {
        logger.error({ id }, "Organization not found");
        return Result.error("Organization not found", "NOT_FOUND");
    }

    logger.info({ id }, "Organization found");
    const org = Organization.fromDb(organization);
    return Result.ok(org);
};

export const OrganizationService = { create, get };
