import { prisma } from "@/db";
import { Action, Resource } from "@/models/access-control";
import { User } from "@/models/user";
import { PermissionService } from "@/service/permission-service";
import { createContextLogger } from "@/utils/context-logger";
import { to } from "@banjoanton/utils";

const logger = createContextLogger("server-permission-service");

type HasCollectionAccessProps = {
    user: User;
    collectionId: string;
    action: Action;
};

const hasCollectionAccess = async ({
    user,
    collectionId,
    action,
}: HasCollectionAccessProps): Promise<boolean> => {
    const hasPermission = PermissionService.userHasPermission(user, Resource.COLLECTION, action);

    if (!hasPermission) {
        return false;
    }

    const [collectionError, collection] = await to(() =>
        prisma.collection.findUnique({
            where: { id: collectionId },
            include: {
                organization: true,
                collectionAccess: true,
            },
        })
    );

    if (collectionError) {
        logger.error({ error: collectionError, collectionId }, "Failed to find collection");
        return false;
    }

    if (!collection) {
        logger.error({ collectionId }, "Collection not found");
        return false;
    }

    if (collection.isPublic) {
        logger.debug({ collectionId }, "Collection is public");
        return true;
    }

    if (collection.organizationId === user.organizationId) {
        logger.debug({ collectionId }, "User is in the same organization as the collection");
        return true;
    }

    if (collection.collectionAccess.some(a => a.organizationId === user.organizationId)) {
        logger.debug({ collectionId }, "User has access to the collection");
        return true;
    }

    return false;
};

type IsCollectionOwnerProps = {
    user: User;
    collectionId: string;
};

const isCollectionOwner = async ({
    user,
    collectionId,
}: IsCollectionOwnerProps): Promise<boolean> => {
    const [collectionError, collection] = await to(() =>
        prisma.collection.findUnique({
            where: { id: collectionId },
        })
    );

    if (collectionError) {
        logger.error({ error: collectionError, collectionId }, "Failed to find collection");
        return false;
    }

    if (!collection) {
        logger.error({ collectionId }, "Collection not found");
        return false;
    }

    return collection.organizationId === user.organizationId;
};

type HasImageAccessProps = {
    user: User;
    imageId: string;
    action: Action;
};

const hasImageAccess = async ({ user, imageId, action }: HasImageAccessProps): Promise<boolean> => {
    const hasPermission = PermissionService.userHasPermission(user, Resource.COLLECTION, action);

    if (!hasPermission) {
        return false;
    }

    const [imageError, image] = await to(() =>
        prisma.image.findUnique({
            where: { id: imageId },
            include: {
                collection: {
                    include: {
                        organization: true,
                        collectionAccess: true,
                    },
                },
            },
        })
    );

    if (imageError) {
        logger.error({ error: imageError, imageId }, "Failed to find image");
        return false;
    }

    if (!image) {
        logger.error({ imageId }, "Image not found");
        return false;
    }

    if (image.collection.isPublic) {
        logger.debug({ imageId }, "Collection is public");
        return true;
    }

    if (image.collection.organizationId === user.organizationId) {
        logger.debug({ imageId }, "User is in the same organization as the collection");
        return true;
    }

    if (image.collection.collectionAccess.some(a => a.organizationId === user.organizationId)) {
        logger.debug({ imageId }, "User has access to the collection");
        return true;
    }

    return false;
};

type IsImageOwnerProps = {
    user: User;
    imageId: string;
};

const isImageOwner = async ({ user, imageId }: IsImageOwnerProps): Promise<boolean> => {
    const [imageError, image] = await to(() =>
        prisma.image.findUnique({
            where: { id: imageId },
            include: {
                collection: {
                    include: {
                        organization: true,
                    },
                },
            },
        })
    );

    if (imageError) {
        logger.error({ error: imageError, imageId }, "Failed to find image");
        return false;
    }

    if (!image) {
        logger.error({ imageId }, "Image not found");
        return false;
    }

    return image.collection.organizationId === user.organizationId;
};

export const ServerPermissionService = {
    hasCollectionAccess,
    isCollectionOwner,
    hasImageAccess,
    isImageOwner,
};
