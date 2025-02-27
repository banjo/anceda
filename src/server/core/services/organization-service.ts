import { createTransaction, prisma } from "@/db";
import { CreateOrganizationType } from "@/server/api/models/create-organization-schema";
import { InvitationStatus, Organization } from "@/models/organization";
import { ORGANIZATION_INCLUDE_CLAUSE } from "@/server/core/models/prisma";
import { createContextLogger } from "@/utils/context-logger";
import { AsyncResultType, Result } from "@/utils/result";
import { to, uuid } from "@banjoanton/utils";
import { EmailService } from "@/server/core/services/email-service";
import { OrganizationRole, UserRole } from "@/models/role";
import { auth } from "@/server/auth";
import { UserService } from "@/server/core/services/user-service";
import { ApiError, createResultFromApiError } from "@/models/api-error";

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

    const [transactionError] = await createTransaction(prisma, async tx => {
        const [userError, user] = await to(() => tx.user.findFirst({ where: { email } }));

        if (userError) {
            logger.error({ error: userError }, "Failed to invite user to organization");
            throw userError;
        }

        if (user) {
            logger.error({ email }, "Email is already in use");
            throw new ApiError("Email is already in use", "BAD_REQUEST");
        }

        const [error, invitation] = await to(() =>
            tx.invitation.create({
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
            throw error;
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
            throw new ApiError("Failed to send email", "INTERNAL_SERVER_ERROR");
        }
    });

    if (transactionError) {
        logger.error({ error: transactionError }, "Failed to invite user to organization");
        return createResultFromApiError(transactionError);
    }

    logger.info({ email, organizationId }, "User invited to organization");
    return Result.ok();
};

const acceptInvite = async (token: string): AsyncResultType<void> => {
    logger.info({ token }, "Accepting invite");

    const [transactionError] = await createTransaction(prisma, async tx => {
        const [error, invitation] = await to(() =>
            tx.invitation.findUnique({
                where: { id: token },
                include: { organization: true },
            })
        );

        if (error) {
            logger.error({ error, token }, "Failed to accept invite");
            throw error;
        }

        if (!invitation) {
            logger.error({ token }, "Invite not found");
            throw new ApiError("Invite not found", "NOT_FOUND");
        }

        if (invitation.status !== InvitationStatus.PENDING) {
            logger.error({ token }, "Invite already accepted");
            throw new ApiError("Invite already accepted", "BAD_REQUEST");
        }

        const [userError, user] = await to(() =>
            tx.user.findFirst({ where: { email: invitation.email } })
        );

        if (userError) {
            logger.error({ error: userError, token }, "Failed to accept invite");
            throw userError;
        }

        if (user) {
            logger.error("Email is already in use");
            throw new ApiError("Email is already in use", "BAD_REQUEST");
        }

        const createdUserResult = await UserService.create(
            {
                email: invitation.email,
                name: invitation.email, // TODO: ask for name
                password: "password", // TODO: ask for password
                role: UserRole.USER,
                emailVerified: true,
            },
            { prisma: tx }
        );

        if (!createdUserResult.ok) {
            logger.error({ message: createdUserResult.message }, "Failed to create user");
            throw new ApiError("Failed to create user", "INTERNAL_SERVER_ERROR");
        }

        const [updateError] = await to(() =>
            tx.invitation.update({
                where: { id: invitation.id },
                data: { status: InvitationStatus.ACCEPTED },
            })
        );

        if (updateError) {
            logger.error({ error: updateError }, "Failed to update invitation");
            throw updateError;
        }

        const [addUserError] = await to(() =>
            tx.member.create({
                data: {
                    organizationId: invitation.organizationId,
                    role: invitation.role,
                    userId: createdUserResult.data.id,
                },
            })
        );

        if (addUserError) {
            logger.error({ addUserError }, "Failed to accept invite");
            throw addUserError;
        }

        return createdUserResult.data;
    });

    if (transactionError) {
        logger.error({ error: transactionError }, "Failed to accept invite");
        return createResultFromApiError(transactionError);
    }

    logger.info({ token }, "Invite accepted");
    return Result.ok();
};

export const OrganizationService = { create, get, inviteUserToOrganization, acceptInvite };
