import { AsyncResultType, Result } from "@/utils/result";
import { createContextLogger } from "@/utils/context-logger";
import { isDefined, to, uuid } from "@banjoanton/utils";
import { Collection } from "@/models/collection";
import { prisma } from "@/db";
import { Prisma } from "@prisma/client";

const logger = createContextLogger("collection-service");

type CreateCollectionProps = {
    name: string;
    organizationId: string;
    description?: string;
};

const createCollection = async (props: CreateCollectionProps): AsyncResultType<Collection> => {
    const { name, description, organizationId } = props;

    const [error, dbCollection] = await to(() =>
        prisma.collection.create({
            data: {
                name,
                description,
                organizationId,
            },
            include: {
                images: true,
            },
        })
    );

    if (error) {
        logger.error({ error, props }, "Failed to create collection");
        return Result.error("Failed to create collection", "INTERNAL_SERVER_ERROR");
    }

    return Result.ok(Collection.fromDb(dbCollection));
};

const getCollection = async (id: string): AsyncResultType<Collection> => {
    const [error, dbCollection] = await to(() =>
        prisma.collection.findUnique({
            where: { id },
            include: {
                images: true,
            },
        })
    );

    if (error) {
        logger.error({ error, id }, "Failed to get collection");
        return Result.error("Failed to get collection", "INTERNAL_SERVER_ERROR");
    }

    if (!dbCollection) {
        return Result.error("Collection not found", "NOT_FOUND");
    }

    return Result.ok(Collection.fromDb(dbCollection));
};

type GetCollectionsProps = {
    collectionIds: string[];
};
const getCollections = async ({
    collectionIds,
}: GetCollectionsProps): AsyncResultType<Collection[]> => {
    const [error, dbCollections] = await to(() =>
        prisma.collection.findMany({
            where: {
                id: {
                    in: collectionIds,
                },
            },
            include: {
                images: true,
            },
        })
    );

    if (error) {
        logger.error({ error }, "Failed to get collections");
        return Result.error("Failed to get collections", "INTERNAL_SERVER_ERROR");
    }

    return Result.ok(dbCollections.map(Collection.fromDb));
};

const getCreatedCollectionsByOrganization = async (
    organizationId: string
): AsyncResultType<Collection[]> => {
    const [error, dbCollections] = await to(() =>
        prisma.collection.findMany({
            where: {
                organizationId,
            },
            include: {
                images: true,
            },
        })
    );

    if (error) {
        logger.error({ error, organizationId }, "Failed to get collections by organization");
        return Result.error("Failed to get collections by organization", "INTERNAL_SERVER_ERROR");
    }

    return Result.ok(dbCollections.map(Collection.fromDb));
};

type UpdateCollectionProps = {
    id: string;
    name?: string;
    description?: string;
    tags?: string[];
};

const updateCollection = async (props: UpdateCollectionProps): AsyncResultType<Collection> => {
    const { id, name, description } = props;

    const [findError, existingCollection] = await to(() =>
        prisma.collection.findUnique({
            where: { id },
        })
    );

    if (findError) {
        logger.error({ error: findError, id }, "Failed to find collection");
        return Result.error("Failed to verify collection", "INTERNAL_SERVER_ERROR");
    }

    if (!existingCollection) {
        return Result.error("Collection not found", "NOT_FOUND");
    }

    const updateData: Prisma.CollectionUpdateInput = {};

    if (isDefined(name)) {
        updateData.name = name;
    }

    if (isDefined(description)) {
        updateData.description = description;
    }

    const [updateError, updatedCollection] = await to(() =>
        prisma.collection.update({
            where: { id },
            data: updateData,
            include: {
                images: true,
            },
        })
    );

    if (updateError) {
        logger.error({ error: updateError, id, updateData }, "Failed to update collection");
        return Result.error("Failed to update collection", "INTERNAL_SERVER_ERROR");
    }

    return Result.ok(Collection.fromDb(updatedCollection));
};

type AddImagesProps = {
    collectionId: string;
    imageIds: string[];
};

const addImages = async (props: AddImagesProps): AsyncResultType<Collection> => {
    const { collectionId, imageIds } = props;

    // Verify collection exists
    const [findError, existingCollection] = await to(() =>
        prisma.collection.findUnique({
            where: { id: collectionId },
        })
    );

    if (findError) {
        logger.error({ error: findError, collectionId }, "Failed to find collection");
        return Result.error("Failed to verify collection", "INTERNAL_SERVER_ERROR");
    }

    if (!existingCollection) {
        return Result.error("Collection not found", "NOT_FOUND");
    }

    // Verify that all images exist
    const [imagesError, images] = await to(() =>
        prisma.image.findMany({
            where: {
                id: {
                    in: imageIds,
                },
            },
        })
    );

    if (imagesError) {
        logger.error({ error: imagesError, imageIds }, "Failed to verify images");
        return Result.error("Failed to verify images", "INTERNAL_SERVER_ERROR");
    }

    if (images.length !== imageIds.length) {
        return Result.error("One or more images not found", "NOT_FOUND");
    }

    // Update collection with images
    const [updateError, updatedCollection] = await to(() =>
        prisma.collection.update({
            where: { id: collectionId },
            data: {
                images: {
                    connect: imageIds.map(id => ({ id })),
                },
            },
            include: {
                images: true,
            },
        })
    );

    if (updateError) {
        logger.error(
            { error: updateError, collectionId, imageIds },
            "Failed to add images to collection"
        );
        return Result.error("Failed to add images to collection", "INTERNAL_SERVER_ERROR");
    }

    return Result.ok(Collection.fromDb(updatedCollection));
};

type RemoveImagesProps = {
    collectionId: string;
    imageIds: string[];
};

const removeImages = async (props: RemoveImagesProps): AsyncResultType<Collection> => {
    const { collectionId, imageIds } = props;

    // Verify collection exists
    const [findError, existingCollection] = await to(() =>
        prisma.collection.findUnique({
            where: { id: collectionId },
        })
    );

    if (findError) {
        logger.error({ error: findError, collectionId }, "Failed to find collection");
        return Result.error("Failed to verify collection", "INTERNAL_SERVER_ERROR");
    }

    if (!existingCollection) {
        return Result.error("Collection not found", "NOT_FOUND");
    }

    // Update collection to disconnect images
    const [updateError, updatedCollection] = await to(() =>
        prisma.collection.update({
            where: { id: collectionId },
            data: {
                images: {
                    disconnect: imageIds.map(id => ({ id })),
                },
            },
            include: {
                images: true,
            },
        })
    );

    if (updateError) {
        logger.error(
            { error: updateError, collectionId, imageIds },
            "Failed to remove images from collection"
        );
        return Result.error("Failed to remove images from collection", "INTERNAL_SERVER_ERROR");
    }

    return Result.ok(Collection.fromDb(updatedCollection));
};

type InviteOrganizationProps = {
    collectionId: string;
    organizationId: string;
};

const inviteOrganization = async (props: InviteOrganizationProps): AsyncResultType => {
    const { collectionId, organizationId } = props;

    const [findError, existingCollection] = await to(() =>
        prisma.collection.findUnique({
            where: { id: collectionId },
        })
    );

    if (findError) {
        logger.error({ error: findError, collectionId }, "Failed to find collection");
        return Result.error("Failed to verify collection", "INTERNAL_SERVER_ERROR");
    }

    if (!existingCollection) {
        logger.error({ collectionId }, "Collection not found");
        return Result.error("Collection not found", "NOT_FOUND");
    }

    const [orgError, organization] = await to(() =>
        prisma.organization.findUnique({
            where: { id: organizationId },
        })
    );

    if (orgError) {
        logger.error({ error: orgError, organizationId }, "Failed to find organization");
        return Result.error("Failed to verify organization", "INTERNAL_SERVER_ERROR");
    }

    if (!organization) {
        logger.error({ organizationId }, "Organization not found");
        return Result.error("Organization not found", "NOT_FOUND");
    }

    const [collectionAccessError] = await to(() =>
        prisma.collectionAccess.create({
            data: {
                collectionId,
                organizationId,
            },
        })
    );

    if (collectionAccessError) {
        logger.error(
            { error: collectionAccessError, collectionId, organizationId },
            "Failed to invite organization to collection"
        );
        return Result.error("Failed to invite organization to collection", "INTERNAL_SERVER_ERROR");
    }

    return Result.ok();
};

const deleteCollection = async (id: string): AsyncResultType<void> => {
    // Verify collection exists
    const [findError, existingCollection] = await to(() =>
        prisma.collection.findUnique({
            where: { id },
        })
    );

    if (findError) {
        logger.error({ error: findError, id }, "Failed to find collection");
        return Result.error("Failed to verify collection", "INTERNAL_SERVER_ERROR");
    }

    if (!existingCollection) {
        return Result.error("Collection not found", "NOT_FOUND");
    }

    // Delete collection
    const [deleteError] = await to(() =>
        prisma.collection.delete({
            where: { id },
        })
    );

    if (deleteError) {
        logger.error({ error: deleteError, id }, "Failed to delete collection");
        return Result.error("Failed to delete collection", "INTERNAL_SERVER_ERROR");
    }

    return Result.ok(undefined);
};

export const CollectionService = {
    createCollection,
    getCollection,
    getCollections,
    getCreatedCollectionsByOrganization,
    updateCollection,
    addImages,
    removeImages,
    inviteOrganization,
    deleteCollection,
};
