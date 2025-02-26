import { OrganizationRole, parseOrganizationRole } from "@/models/role";
import { invariant } from "@banjoanton/utils";
import { Prisma, Organization as PrismaOrganization } from "@prisma/client";

// TYPES
type DatabaseOrganization = Prisma.OrganizationGetPayload<{
    include: {
        invitedOrganizations: true;
        primaryOrganization: true;
        invitations: true;
        members: true;
    };
}>;

export type Member = {
    id: string;
    role: OrganizationRole;
    organizationId: string;
    userId: string;
};

export const InvitationStatus = {
    PENDING: "PENDING",
    ACCEPTED: "ACCEPTED",
    DECLINED: "DECLINED",
} as const;

export const parseInvitationStatus = (status: string): InvitationStatus => {
    invariant(status in InvitationStatus, "Invalid invitation status");
    return status as InvitationStatus;
};

export type InvitationStatus = keyof typeof InvitationStatus;

export type Invitation = {
    id: string;
    email: string;
    role: OrganizationRole;
    organizationId: string;
    expiresAt: Date;
    status: InvitationStatus;
};

export const OrganizationType = {
    PRIMARY: "PRIMARY",
    SECONDARY: "SECONDARY",
} as const;

export type OrganizationType = keyof typeof OrganizationType;

type OrganizationBase = {
    id: string;
    name: string;
    slug?: string;
    logo?: string;
    createdAt: Date;
    type: OrganizationType;
};

type FullOrganization = OrganizationBase & {
    members: Member[];
    invitations: Invitation[];
};

export type PrimaryOrganization = FullOrganization & {
    type: "PRIMARY";
    invitedOrganizations: OrganizationBase[]; // Organization IDs
};

export type SecondaryOrganization = FullOrganization & {
    type: "SECONDARY";
    primaryOrganization: OrganizationBase;
};

export type Organization = PrimaryOrganization | SecondaryOrganization;

// FUNCTIONS
const primary = (org: PrimaryOrganization) => org;
const secondary = (org: SecondaryOrganization) => org;
const from = (org: Organization) => org;

const baseFromDb = (org: PrismaOrganization): OrganizationBase => ({
    id: org.id,
    name: org.name,
    slug: org.slug ?? undefined,
    logo: org.logo ?? undefined,
    createdAt: org.createdAt,
    type: org.type,
});

const fullFromDb = (org: DatabaseOrganization): FullOrganization => {
    const base = baseFromDb(org);

    return {
        ...base,
        invitations: org.invitations.map(inv => ({
            id: inv.id,
            email: inv.email,
            role: parseOrganizationRole(inv.role),
            organizationId: inv.organizationId,
            expiresAt: inv.expiresAt,
            status: parseInvitationStatus(inv.status),
        })),
        members: org.members.map(mem => ({
            id: mem.id,
            role: parseOrganizationRole(mem.role),
            organizationId: mem.organizationId,
            userId: mem.userId,
        })),
    };
};

const fromDb = (org: DatabaseOrganization): Organization => {
    const base = fullFromDb(org);

    if (org.type === OrganizationType.PRIMARY) {
        return {
            ...base,
            type: OrganizationType.PRIMARY,
            invitedOrganizations: org.invitedOrganizations.map(baseFromDb),
        };
    }

    invariant(org.primaryOrganizationId, "Secondary organization must have a primary organization");
    invariant(org.primaryOrganization, "Secondary organization must have a primary organization");

    return {
        ...base,
        primaryOrganization: baseFromDb(org.primaryOrganization),
        type: OrganizationType.SECONDARY,
    };
};

export const Organization = { from, fromDb, primary, secondary };
