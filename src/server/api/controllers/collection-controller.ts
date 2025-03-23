import { Action, Resource } from "@/models/access-control";
import { createAuthorizedApiInstance } from "@/server/api/api-instance";
import {
    createResponseFromResult,
    createResponseFromVoidResult,
} from "@/server/api/controller-model";
import { permissionMiddleware } from "@/server/core/middleware/permission-middleware";
import { CollectionService } from "@/server/core/services/collection-service";
import { createContextLogger } from "@/utils/context-logger";
import { sValidator } from "@hono/standard-validator";
import { z } from "zod";

const logger = createContextLogger("collection-controller");

const CreateCollectionSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    organizationId: z.string(),
});

const UpdateCollectionSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
});

const AddImagesSchema = z.object({
    imageIds: z.array(z.string()),
});

const RemoveImagesSchema = z.object({
    imageIds: z.array(z.string()),
});

const InviteSchema = z.object({
    organizationId: z.string(),
});

export const collectionController = createAuthorizedApiInstance()
    .get("/:id", permissionMiddleware(Resource.COLLECTION, Action.READ), async c => {
        const id = c.req.param("id");
        logger.debug({ id }, "Getting collection request");

        const result = await CollectionService.getCollection(id);
        return createResponseFromResult(c, result);
    })
    .get("/", permissionMiddleware(Resource.COLLECTION, Action.READ), async c => {
        logger.debug("Getting collections request");

        const result = await CollectionService.getCollections();
        return createResponseFromResult(c, result);
    })
    .post(
        "/",
        permissionMiddleware(Resource.COLLECTION, Action.CREATE),
        sValidator("json", CreateCollectionSchema),
        async c => {
            const data = c.req.valid("json");
            logger.debug({ data }, "Creating collection request");

            const result = await CollectionService.createCollection(data);
            return createResponseFromResult(c, result);
        }
    )
    .put(
        "/:id",
        permissionMiddleware(Resource.COLLECTION, Action.UPDATE),
        sValidator("json", UpdateCollectionSchema),
        async c => {
            const id = c.req.param("id");
            const data = c.req.valid("json");
            logger.debug({ id, data }, "Updating collection request");

            const result = await CollectionService.updateCollection({ id, ...data });
            return createResponseFromResult(c, result);
        }
    )
    .post(
        "/:id/images",
        permissionMiddleware(Resource.COLLECTION, Action.UPDATE),
        sValidator("json", AddImagesSchema),
        async c => {
            const id = c.req.param("id");
            const { imageIds } = c.req.valid("json");
            logger.debug({ id, imageIds }, "Adding images to collection request");

            const result = await CollectionService.addImages({ collectionId: id, imageIds });
            return createResponseFromResult(c, result);
        }
    )
    .delete(
        "/:id/images",
        permissionMiddleware(Resource.COLLECTION, Action.UPDATE),
        sValidator("json", RemoveImagesSchema),
        async c => {
            const id = c.req.param("id");
            const { imageIds } = c.req.valid("json");
            logger.debug({ id, imageIds }, "Removing images from collection request");

            const result = await CollectionService.removeImages({ collectionId: id, imageIds });
            return createResponseFromResult(c, result);
        }
    )
    .post(
        "/:id/invite",
        permissionMiddleware(Resource.COLLECTION, Action.UPDATE),
        sValidator("json", InviteSchema),
        async c => {
            const id = c.req.param("id");
            const { organizationId } = c.req.valid("json");
            logger.debug({ id, organizationId }, "Inviting user to collection request");

            const result = await CollectionService.inviteUser({ collectionId: id, organizationId });
            return createResponseFromResult(c, result);
        }
    )
    .delete("/:id", permissionMiddleware(Resource.COLLECTION, Action.DELETE), async c => {
        const id = c.req.param("id");
        logger.debug({ id }, "Deleting collection request");

        const result = await CollectionService.deleteCollection(id);
        return createResponseFromVoidResult(c, result);
    });
