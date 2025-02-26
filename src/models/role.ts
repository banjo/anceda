export const UserRole = {
    ADMIN: "admin",
    USER: "user",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const parseUserRole = (role: unknown): UserRole => {
    switch (role) {
        case UserRole.ADMIN:
            return UserRole.ADMIN;
        case UserRole.USER:
            return UserRole.USER;
        default:
            throw new Error(`Invalid user role: ${role}`);
    }
};

export const OrganizationRole = {
    PRIMARY_OWNER: "PRIMARY_OWNER",
    PRIMARY_ADMIN: "PRIMARY_ADMIN",
    SECONDARY_OWNER: "SECONDARY_OWNER",
    SECONDARY_ADMIN: "SECONDARY_ADMIN",
} as const;
export type OrganizationRole = (typeof OrganizationRole)[keyof typeof OrganizationRole];

export const parseOrganizationRole = (role: unknown): OrganizationRole => {
    switch (role) {
        case OrganizationRole.PRIMARY_OWNER:
            return OrganizationRole.PRIMARY_OWNER;
        case OrganizationRole.PRIMARY_ADMIN:
            return OrganizationRole.PRIMARY_ADMIN;
        case OrganizationRole.SECONDARY_OWNER:
            return OrganizationRole.SECONDARY_OWNER;
        case OrganizationRole.SECONDARY_ADMIN:
        default:
            throw new Error(`Invalid organization role: ${role}`);
    }
};
