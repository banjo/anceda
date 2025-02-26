import { prisma } from "@/db";
import { CreateOrganizationType } from "@/server/api/models/create-organization-schema";
import { InvitationStatus, Organization } from "@/models/organization";
import { ORGANIZATION_INCLUDE_CLAUSE } from "@/server/core/models/prisma";
import { createContextLogger } from "@/utils/context-logger";
import { AsyncResultType, Result } from "@/utils/result";
import { to, uuid } from "@banjoanton/utils";
import { EmailService } from "@/server/core/services/email-service";
import { OrganizationRole, UserRole } from "@/models/role";
import { auth } from "@/server/auth";

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

    const [userError, user] = await to(() => prisma.user.findFirst({ where: { email } }));

    if (userError) {
        logger.error({ error: userError }, "Failed to invite user to organization");
        return Result.error(userError.message, "INTERNAL_SERVER_ERROR");
    }

    if (!user) {
        logger.error({ email }, "Email is already in use");
        return Result.error("Email is already in use", "BAD_REQUEST");
    }

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

const acceptInvite = async (token: string): AsyncResultType<void> => {
    logger.info({ token }, "Accepting invite");
    const [error, invitation] = await to(() =>
        prisma.invitation.findUnique({
            where: { id: token },
            include: { organization: true },
        })
    );

    if (error) {
        logger.error({ error, token }, "Failed to accept invite");
        return Result.error(error.message, "INTERNAL_SERVER_ERROR");
    }

    if (!invitation) {
        logger.error({ token }, "Invite not found");
        return Result.error("Invite not found", "NOT_FOUND");
    }

    if (invitation.status !== InvitationStatus.PENDING) {
        logger.error({ token }, "Invite already accepted");
        return Result.error("Invite already accepted", "BAD_REQUEST");
    }

    const [userError, user] = await to(() =>
        prisma.user.findFirst({ where: { email: invitation.email } })
    );

    if (userError) {
        logger.error({ error: userError, token }, "Failed to accept invite");
        return Result.error(userError.message, "INTERNAL_SERVER_ERROR");
    }

    if (user) {
        logger.error("Email is already in use");
        return Result.error("Email is already in use", "BAD_REQUEST");
    }

    // TODO: user service to create user with password
    const [createUserError, createdUser] = await to(() =>
        prisma.user.create({
            data: {
                email: invitation.email,
                name: invitation.email, // TODO: ask for name
                role: UserRole.USER,
                emailVerified: true,
            },
        })
    );

    if (createUserError) {
        logger.error({ error: createUserError }, "Failed to accept invite");
        return Result.error(createUserError.message, "INTERNAL_SERVER_ERROR");
    }

    const ctx = await auth.$context;
    const password = await ctx.password.hash("password"); // TODO: ask for password

    const [accountError] = await to(() =>
        prisma.account.create({
            data: {
                accountId: uuid(), // TODO: check if this is correct?
                providerId: "credential",
                password,
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

    const [updateError] = await to(() =>
        prisma.invitation.update({
            where: { id: invitation.id },
            data: { status: InvitationStatus.ACCEPTED },
        })
    );

    if (updateError) {
        logger.error({ error: updateError }, "Failed to accept invite");
        return Result.error(updateError.message, "INTERNAL_SERVER_ERROR");
    }

    const [addUserError] = await to(() =>
        prisma.member.create({
            data: {
                organizationId: invitation.organizationId,
                role: invitation.role,
                userId: createdUser.id,
            },
        })
    );

    if (addUserError) {
        logger.error({ addUserError }, "Failed to accept invite");
        return Result.error(addUserError.message, "INTERNAL_SERVER_ERROR");
    }

    logger.info({ token }, "Invite accepted");
    return Result.ok();
};

export const OrganizationService = { create, get, inviteUserToOrganization, acceptInvite };
