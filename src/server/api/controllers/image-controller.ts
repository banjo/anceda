import { Action, Resource } from "@/models/access-control";
import { createAuthorizedApiInstance } from "@/server/api/api-instance";
import {
    createResponseFromResult,
    createResponseFromVoidResult,
} from "@/server/api/controller-model";
import { permissionMiddleware } from "@/server/core/middleware/permission-middleware";
import { ImageService } from "@/server/core/services/image-service";
import { createContextLogger } from "@/utils/context-logger";
import { sValidator } from "@hono/standard-validator";
import { z } from "zod";

const logger = createContextLogger("image-controller");

const UpdateImageSchema = z.object({
    originalName: z.string().optional(),
    tags: z.array(z.string()).optional(),
    collectionId: z.string().optional(),
});

const GetImagesSchema = z.object({
    collectionId: z.string().optional(),
    ids: z.array(z.string()).optional(),
    limit: z.number().int().positive().optional(),
    offset: z.number().int().min(0).optional(),
    tags: z.array(z.string()).optional(),
});

export const imageController = createAuthorizedApiInstance()
    .get("/:id", permissionMiddleware(Resource.COLLECTION, Action.READ), async c => {
        const id = c.req.param("id");
        logger.debug({ id }, "Getting image request");

        const result = await ImageService.getImage(id);
        return createResponseFromResult(c, result);
    })
    .get(
        "/",
        permissionMiddleware(Resource.COLLECTION, Action.READ),
        sValidator("query", GetImagesSchema),
        async c => {
            const query = c.req.valid("query");
            logger.debug({ query }, "Getting images request");

            const result = await ImageService.getImages(query);
            return createResponseFromResult(c, result);
        }
    )
    .put(
        "/:id",
        permissionMiddleware(Resource.COLLECTION, Action.UPDATE),
        sValidator("json", UpdateImageSchema),
        async c => {
            const id = c.req.param("id");
            const data = c.req.valid("json");
            logger.debug({ id, data }, "Updating image request");

            const result = await ImageService.updateImage({ id, ...data });
            return createResponseFromResult(c, result);
        }
    )
    .delete("/:id", permissionMiddleware(Resource.COLLECTION, Action.DELETE), async c => {
        const id = c.req.param("id");
        logger.debug({ id }, "Deleting image request");

        const result = await ImageService.deleteImage(id);
        return createResponseFromVoidResult(c, result);
    });
