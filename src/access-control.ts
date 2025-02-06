import {
    adminAc,
    createAccessControl,
    defaultStatements,
    ownerAc,
} from "better-auth/plugins/access";

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

export const roles = { superAdmin, primaryOwner, primaryAdmin, secondaryOwner, secondaryAdmin };
