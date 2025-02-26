import { OrganizationRole } from "@/models/role";
import { z } from "zod";

export const InviteUserSchema = z.object({
    email: z.string(),
    role: z.nativeEnum(OrganizationRole),
});

export type InviteUserType = z.infer<typeof InviteUserSchema>;
