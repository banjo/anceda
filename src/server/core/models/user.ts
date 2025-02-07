import { Maybe } from "@banjoanton/utils";
import { parseRole, Role } from "./role";
import { ApiSession, ApiUser } from "../../auth";

export type User = {
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
