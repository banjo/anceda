import { OrganizationRole } from "@/models/role";

export const Action = {
    CREATE: "CREATE",
    READ: "READ",
    UPDATE: "UPDATE",
    DELETE: "DELETE",
} as const;
export type Action = (typeof Action)[keyof typeof Action];

export const Resource = {
    ORGANIZATION: "ORGANIZATION",
    SECONDARY_ORGANIZATION: "SECONDARY_ORGANIZATION",
    COLLECTION: "COLLECTION",
    MEMBER: "MEMBER",
    INVITE_MEMBER: "INVITE_MEMBER",
} as const;
export type Resource = (typeof Resource)[keyof typeof Resource];

export const ValidPermissions = {
    ORGANIZATION: [Action.UPDATE],
    SECONDARY_ORGANIZATION: [Action.CREATE, Action.UPDATE, Action.DELETE],
    INVITE_MEMBER: [Action.CREATE, Action.DELETE],
    MEMBER: [Action.CREATE, Action.UPDATE, Action.DELETE],
    COLLECTION: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE],
} as const;

export type ValidPermissions = typeof ValidPermissions;

export type Permission = {
    [K in keyof typeof ValidPermissions]?:
        | ReadonlyArray<(typeof ValidPermissions)[K][number]>
        | (typeof ValidPermissions)[K][number][];
};

export type RBAC = {
    [key in OrganizationRole]: Permission;
};

export const PERMISSIONS: RBAC = {
    PRIMARY_OWNER: {
        ORGANIZATION: [Action.UPDATE],
        SECONDARY_ORGANIZATION: [Action.CREATE],
        COLLECTION: ValidPermissions.COLLECTION,
        INVITE_MEMBER: ValidPermissions.INVITE_MEMBER,
        MEMBER: ValidPermissions.MEMBER,
    },
    PRIMARY_ADMIN: {
        ORGANIZATION: [Action.UPDATE],
        SECONDARY_ORGANIZATION: [Action.CREATE],
        COLLECTION: ValidPermissions.COLLECTION,
        INVITE_MEMBER: ValidPermissions.INVITE_MEMBER,
        MEMBER: ValidPermissions.MEMBER,
    },
    SECONDARY_OWNER: {
        ORGANIZATION: [Action.UPDATE],
        SECONDARY_ORGANIZATION: [],
        COLLECTION: [Action.READ],
        INVITE_MEMBER: ValidPermissions.INVITE_MEMBER,
        MEMBER: ValidPermissions.MEMBER,
    },
    SECONDARY_ADMIN: {
        ORGANIZATION: [Action.UPDATE],
        SECONDARY_ORGANIZATION: [],
        COLLECTION: [Action.READ],
        INVITE_MEMBER: ValidPermissions.INVITE_MEMBER,
        MEMBER: ValidPermissions.MEMBER,
    },
};
