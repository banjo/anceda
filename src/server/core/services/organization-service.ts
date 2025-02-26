import { prisma } from "@/db";
import { CreateOrganizationType } from "@/server/api/models/create-organization-schema";
import { InvitationStatus, Organization } from "@/models/organization";
import { ORGANIZATION_INCLUDE_CLAUSE } from "@/server/core/models/prisma";
import { createContextLogger } from "@/utils/context-logger";
import { AsyncResultType, Result } from "@/utils/result";
import { to, uuid } from "@banjoanton/utils";
import { EmailService } from "@/server/core/services/email-service";
import { OrganizationRole } from "@/models/role";

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

type InviteUserToOrganizationProps = {
    organizationId: string;
    email: string;
    inviterId: string;
    role: OrganizationRole;
};

const inviteUserToOrganization = async ({
    organizationId,
    email,
    inviterId,
    role,
}: InviteUserToOrganizationProps): AsyncResultType<void> => {
    logger.info({ email, organizationId }, "Inviting user to organization");

    const [error, invitation] = await to(() =>
        prisma.invitation.create({
            data: {
                email,
                organizationId,
                inviterId,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // TODO: create this constant
                role,
                status: InvitationStatus.PENDING,
            },
        })
    );

    if (error) {
        logger.error({ error }, "Failed to invite user to organization");
        return Result.error(error.message, "INTERNAL_SERVER_ERROR");
    }

    const emailResult = await EmailService.inviteUserToOrganization(
        invitation.id,
        email,
        organizationId
    );

    if (!emailResult.ok) {
        logger.error(
            { message: emailResult.message, email, organizationId },
            "Failed to invite user to organization"
        );
        return Result.error(emailResult.message, "INTERNAL_SERVER_ERROR");
    }

    logger.info({ email, organizationId }, "User invited to organization");
    return Result.ok();
};

export const OrganizationService = { create, get, inviteUserToOrganization };
