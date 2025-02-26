import { PERMISSIONS, Resource, ValidPermissions } from "@/models/access-control";
import { OrganizationRole } from "@/models/role";
import { User } from "@/models/user";

const hasPermission = <R extends Resource>(
    role: OrganizationRole,
    resource: R,
    action: ValidPermissions[R][number]
): boolean => {
    const allowedActions = PERMISSIONS[role][resource];
    if (!allowedActions) {
        return false;
    }

    return allowedActions.includes(action);
};

const userHasPermission = <R extends Resource>(
    user: User,
    resource: R,
    action: ValidPermissions[R][number]
): boolean => hasPermission(user.organizationRole, resource, action);

export const PermissionService = {
    hasPermission,
    userHasPermission,
};
