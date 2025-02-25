import { ApiFullSession } from "@/server/auth";
import {
    OrganizationRole,
    parseOrganizationRole,
    parseUserRole,
    UserRole,
} from "@/server/core/models/role";
import { Maybe } from "@banjoanton/utils";

export type User = {
    id: string;
    name: string;
    email: string;
    isVerified: boolean;
    image: Maybe<string>;
    role: UserRole;
    isAdmin: boolean;
    createdAt: Date;
    ipAddress: Maybe<string>;
    organizationId: string;
    organizationRole: OrganizationRole;
};

export const User = {
    from: (user: User): User => user,
    fromHeaders: (fullSession: ApiFullSession): User => {
        const user = fullSession.user;
        const session = fullSession.session;

        return {
            id: user.id,
            organizationId: user.organizationId,
            organizationRole: parseOrganizationRole(user.organizationRole),
            createdAt: user.createdAt,
            email: user.email,
            image: user.image ?? undefined,
            ipAddress: session.ipAddress ?? undefined,
            isVerified: user.emailVerified,
            name: user.name,
            role: parseUserRole(user.role),
            isAdmin: parseUserRole(user.role) === UserRole.ADMIN,
        };
    },
};
