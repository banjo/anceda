import { OrganizationType } from "@/server/core/models/organization";
import { z } from "zod";

export const CreateOrganizationSchema = z.object({
    name: z.string(),
    type: z.enum([OrganizationType.PRIMARY, OrganizationType.SECONDARY]),
    primaryOrganizationId: z.string().optional(),
});

export type CreateOrganizationType = z.infer<typeof CreateOrganizationSchema>;
