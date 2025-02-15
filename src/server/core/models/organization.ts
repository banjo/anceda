import { Organization as DbOrganization, OrganizationType } from "@prisma/client";

export type Organization = {
    id: string;
    name: string;
    slug?: string;
    logo?: string;
    createdAt: Date;
    orgnizationType: OrganizationType;
};

const from = (org: Organization) => org;

const fromDb = (dbOrg: DbOrganization): Organization => ({
    id: dbOrg.id,
    name: dbOrg.name,
    slug: dbOrg.slug ?? undefined,
    logo: dbOrg.logo ?? undefined,
    createdAt: dbOrg.createdAt,
    orgnizationType: dbOrg.type,
});

export const Organization = { from, fromDb };
