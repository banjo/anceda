import {
    adminAc,
    createAccessControl,
    defaultStatements,
    ownerAc,
} from "better-auth/plugins/access";

export const OrganizationRole = {
    SUPER_ADMIN: "SUPER_ADMIN",
    PRIMARY_OWNER: "PRIMARY_OWNER",
    PRIMARY_ADMIN: "PRIMARY_ADMIN",
    SECONDARY_OWNER: "SECONDARY_OWNER",
    SECONDARY_ADMIN: "SECONDARY_ADMIN",
} as const;

const statement = {
    ...defaultStatements,
    collection: ["create", "read", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

const superAdmin = ac.newRole({
    ...ownerAc.statements,
    collection: ["create", "read", "update", "delete"],
});

const primaryOwner = ac.newRole({
    ...ownerAc.statements,
    organization: ["update"],
    collection: ["create", "read", "update", "delete"],
});

const primaryAdmin = ac.newRole({
    ...adminAc.statements,
    organization: ["update"],
    collection: ["create", "read", "update", "delete"],
});

const secondaryOwner = ac.newRole({
    ...ownerAc.statements,
    organization: ["update"],
    collection: ["read"],
});

const secondaryAdmin = ac.newRole({
    ...adminAc.statements,
    organization: ["update"],
    collection: ["read"],
});

export const roles = {
    SUPER_ADMIN: superAdmin,
    PRIMARY_OWNER: primaryOwner,
    PRIMARY_ADMIN: primaryAdmin,
    SECONDARY_OWNER: secondaryOwner,
    SECONDARY_ADMIN: secondaryAdmin,
};
