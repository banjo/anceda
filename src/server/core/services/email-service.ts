import { AsyncResultType } from "@/utils/result";

const inviteUserToOrganization = async (
    inviteId: string,
    email: string,
    organizationId: string
): AsyncResultType<void> => {
    throw new Error("Not implemented");
};

export const EmailService = { inviteUserToOrganization };
