import { OrganizationRole, parseOrganizationRole } from "@/server/core/models/role";
import { invariant } from "@banjoanton/utils";
import { OrganizationType, Prisma, Organization as PrismaOrganization } from "@prisma/client";

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

export type Invitation = {
    id: string;
    email: string;
    role: OrganizationRole;
    organizationId: string;
    expiresAt: Date;
};

type OrganizationBase = {
    id: string;
    name: string;
    slug?: string;
    logo?: string;
    createdAt: Date;
    orgnizationType: OrganizationType;
};

type FullOrganization = OrganizationBase & {
    members: Member[];
    invitations: Invitation[];
};

export type PrimaryOrganization = FullOrganization & {
    orgnizationType: "PRIMARY";
    invitedOrganizations: OrganizationBase[]; // Organization IDs
};

export type SecondaryOrganization = FullOrganization & {
    orgnizationType: "SECONDARY";
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
    orgnizationType: org.type,
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

    if (org.type === "PRIMARY") {
        return {
            ...base,
            orgnizationType: "PRIMARY",
            invitedOrganizations: org.invitedOrganizations.map(baseFromDb),
        };
    }

    invariant(org.primaryOrganizationId, "Secondary organization must have a primary organization");
    invariant(org.primaryOrganization, "Secondary organization must have a primary organization");

    return {
        ...base,
        primaryOrganization: baseFromDb(org.primaryOrganization),
        orgnizationType: "SECONDARY",
    };
};

export const Organization = { from, fromDb, primary, secondary };
