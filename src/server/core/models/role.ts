export const Role = {
    ADMIN: "admin",
    USER: "user",
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const parseRole = (role: unknown): Role => {
    switch (role) {
        case Role.ADMIN:
            return Role.ADMIN;
        case Role.USER:
        default:
            return Role.USER;
    }
};
