import { User } from "@/server/core/models/user";
import { Organization as DbOrganization, OrganizationType } from "@prisma/client";

type Organization = {
    id: string;
    name: string;
    slug?: string;
    logo?: string;
    createdAt: Date;
    orgnizationType: OrganizationType;
    members: User[];
};

const from = (org: Organization) => org;

const fromDb = (dbOrg: DbOrganization): Organization => ({
    id: dbOrg.id,
    name: dbOrg.name,
    slug: dbOrg.slug ?? undefined,
    logo: dbOrg.logo ?? undefined,
    createdAt: dbOrg.createdAt,
    orgnizationType: dbOrg.type,
    members: [], // TODO: Implement this
});

export const Organization = { from, fromDb };
