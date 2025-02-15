import { OrganizationType } from "@prisma/client";
import { z } from "zod";

export const CreateOrganizationSchema = z.object({
    name: z.string(),
    type: z.enum([OrganizationType.PRIMARY, OrganizationType.SECONDARY]),
    primaryOrganizationId: z.string().optional(),
});

export type CreateOrganizationSchemaType = z.infer<typeof CreateOrganizationSchema>;
