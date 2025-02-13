import { ApiSession, ApiUser } from "@/server/auth";
import { parseRole, Role } from "@/server/core/models/role";
import { Maybe } from "@banjoanton/utils";

export type User = {
    id: string;
    name: string;
    email: string;
    isVerified: boolean;
    image: Maybe<string>;
    role: Role;
    isAdmin: boolean;
    createdAt: Date;
    ipAddress: Maybe<string>;
    activeOrganizationId: Maybe<string>;
};

export const User = {
    from: (user: User): User => user,
    fromHeaders: (user: ApiUser, session: ApiSession): User => ({
        id: user.id,
        activeOrganizationId: session.activeOrganizationId ?? undefined,
        createdAt: user.createdAt,
        email: user.email,
        image: user.image ?? undefined,
        ipAddress: session.ipAddress ?? undefined,
        isVerified: user.emailVerified,
        name: user.name,
        role: parseRole(user.role),
        isAdmin: parseRole(user.role) === Role.ADMIN,
    }),
};
