import { PERMISSIONS, Resource, ValidPermissions } from "@/models/access-control";
import { OrganizationRole } from "@/server/core/models/role";

export const hasPermission = <R extends Resource>(
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
