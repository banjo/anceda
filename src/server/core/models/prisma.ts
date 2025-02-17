import { Prisma } from "@prisma/client";

type OrganizationDataType = "FULL" | "BASE";
type OrganizationIncludeClause = Record<OrganizationDataType, Prisma.OrganizationInclude>;
/**
 * Prisma model includes
 */
export const ORGANIZATION_INCLUDE_CLAUSE: OrganizationIncludeClause = {
    FULL: {
        invitedOrganizations: true,
        primaryOrganization: true,
        invitations: true,
        members: true,
    },
    BASE: {
        invitedOrganizations: true,
        primaryOrganization: true,
    },
};
