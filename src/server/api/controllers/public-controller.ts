import { createPublicApiInstance } from "@/server/api/api-instance";
import { createResponseFromResult } from "@/server/api/controller-model";
import { OrganizationService } from "@/server/core/services/organization-service";
import { createContextLogger } from "@/utils/context-logger";
import { sValidator } from "@hono/standard-validator";
import { z } from "zod";

const logger = createContextLogger("public-controller");

export const publicController = createPublicApiInstance().post(
    "/invite/accept",
    sValidator("json", z.object({ token: z.string() })),
    async c => {
        logger.debug("Accepting invite request");
        const { token } = c.req.valid("json");

        const res = await OrganizationService.acceptInvite(token);
        return createResponseFromResult(res, c);
    }
);
