import { ApiFullSession } from "@/server/auth";
import {
    OrganizationRole,
    parseOrganizationRole,
    parseUserRole,
    UserRole,
} from "@/server/core/models/role";
import { Maybe } from "@banjoanton/utils";
import { OrganizationType } from "@prisma/client";

export type User = {
    id: string;
    name: string;
    email: string;
    isVerified: boolean;
    image: Maybe<string>;
    role: UserRole;
    isAdmin: boolean;
    createdAt: Date;
    organizationId: string;
    organizationRole: OrganizationRole;
    organizationType: OrganizationType;
};

export const User = {
    from: (user: User): User => user,
    fromApiSession: (fullSession: ApiFullSession): User => {
        const user = fullSession.user;

        return {
            id: user.id,
            organizationId: user.organizationId,
            organizationRole: parseOrganizationRole(user.organizationRole),
            organizationType:
                user.organizationType === OrganizationType.PRIMARY
                    ? OrganizationType.PRIMARY
                    : OrganizationType.SECONDARY,
            createdAt: user.createdAt,
            email: user.email,
            image: user.image ?? undefined,
            isVerified: user.emailVerified,
            name: user.name,
            role: parseUserRole(user.role),
            isAdmin: parseUserRole(user.role) === UserRole.ADMIN,
        };
    },
};
