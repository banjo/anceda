import { invariant } from "@banjoanton/utils";
import { Organization as DbOrganization, OrganizationType } from "@prisma/client";

type OrganizationBase = {
    id: string;
    name: string;
    slug?: string;
    logo?: string;
    createdAt: Date;
    orgnizationType: OrganizationType;
};

export type PrimaryOrganization = OrganizationBase & {
    orgnizationType: "PRIMARY";
    invitedOrganizations: string[]; // Organization IDs
};

export type SecondaryOrganization = OrganizationBase & {
    orgnizationType: "SECONDARY";
    primaryOrganization: string; // Organization ID
};

export type Organization = PrimaryOrganization | SecondaryOrganization;

const primary = (org: PrimaryOrganization) => org;
const secondary = (org: SecondaryOrganization) => org;
const from = (org: Organization) => org;

const fromDb = (dbOrg: DbOrganization): Organization => {
    const base: OrganizationBase = {
        id: dbOrg.id,
        name: dbOrg.name,
        slug: dbOrg.slug ?? undefined,
        logo: dbOrg.logo ?? undefined,
        createdAt: dbOrg.createdAt,
        orgnizationType: dbOrg.type,
    };

    if (dbOrg.type === "PRIMARY") {
        return {
            ...base,
            orgnizationType: "PRIMARY",
            invitedOrganizations: [], // TODO: Implement this
        };
    }

    invariant(
        dbOrg.primaryOrganizationId,
        "Secondary organization must have a primary organization"
    );

    return {
        ...base,
        orgnizationType: "SECONDARY",
        primaryOrganization: dbOrg.primaryOrganizationId,
    };
};

export const Organization = { from, fromDb, primary, secondary };
