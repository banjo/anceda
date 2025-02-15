import { z } from "zod";

export const CreateOrganizationSchema = z.object({
    name: z.string(),
});

export type CreateOrganizationSchemaType = z.infer<typeof CreateOrganizationSchema>;
