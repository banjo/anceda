import { createContextLogger } from "@/utils/context-logger";
import { AsyncResultType, Result } from "@/utils/result";
import { isDefined, to, toSeconds, uuid } from "@banjoanton/utils";
import {
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prisma } from "@/db";
import { Image } from "@/models/image";
import { Prisma } from "@prisma/client";
import { Readable } from "node:stream";
import { Env } from "@/utils/env";

const logger = createContextLogger("image-service");
const env = Env.server();

const s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
});

const BUCKET_NAME = env.R2_BUCKET_NAME;
const URL_EXPIRATION_SECONDS = toSeconds({ hours: 24 });

type UploadImageProps = {
    file: Buffer;
    filename: string;
    mimeType: string;
    originalName?: string;
    size: number;
    width?: number;
    height?: number;
    collectionId: string;
    tags?: string[];
};

const uploadImage = async (props: UploadImageProps): AsyncResultType<Image> => {
    const {
        file,
        filename,
        mimeType,
        originalName,
        size,
        width,
        height,
        collectionId,
        tags = [],
    } = props;

    // Verify collection exists
    const [collectionError, collection] = await to(() =>
        prisma.collection.findUnique({ where: { id: collectionId } })
    );

    if (collectionError) {
        logger.error({ error: collectionError, collectionId }, "Failed to find collection");
        return Result.error("Failed to verify collection", "INTERNAL_SERVER_ERROR");
    }

    if (!collection) {
        return Result.error("Collection not found", "NOT_FOUND");
    }

    // Generate unique path for the image
    const id = uuid();

    // TODO: make path name correct
    const path = `${collectionId}/${id}-${filename}`;

    // Upload to R2
    const [uploadError] = await to(() =>
        s3Client.send(
            new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: path,
                Body: file,
                ContentType: mimeType,
            })
        )
    );

    if (uploadError) {
        logger.error({ error: uploadError, path }, "Failed to upload image to R2");
        return Result.error("Failed to upload image", "INTERNAL_SERVER_ERROR");
    }

    // Create signed URL
    const [urlError, signedUrl] = await to(() =>
        getSignedUrl(
            s3Client,
            new GetObjectCommand({
                Bucket: BUCKET_NAME,
                Key: path,
            }),
            { expiresIn: URL_EXPIRATION_SECONDS }
        )
    );

    if (urlError) {
        logger.error({ error: urlError, path }, "Failed to generate signed URL");
        return Result.error("Failed to generate image URL", "INTERNAL_SERVER_ERROR");
    }

    // Store metadata in database
    const [dbError, dbImage] = await to(() =>
        prisma.image.create({
            data: {
                id,
                filename,
                originalName,
                path,
                url: signedUrl,
                mimeType,
                size,
                width,
                height,
                collectionId,
                tags,
            },
        })
    );

    if (dbError) {
        logger.error({ error: dbError }, "Failed to store image metadata in database");

        // Attempt to clean up R2 object since DB insertion failed
        await to(() =>
            s3Client.send(
                new DeleteObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: path,
                })
            )
        );

        return Result.error("Failed to store image metadata", "INTERNAL_SERVER_ERROR");
    }

    return Result.ok(Image.fromDb(dbImage));
};

/**
 * Get an image by ID with refreshed signed URL
 */
const getImage = async (id: string): AsyncResultType<Image> => {
    const [dbError, dbImage] = await to(() =>
        prisma.image.findUnique({
            where: { id },
        })
    );

    if (dbError) {
        logger.error({ error: dbError, id }, "Failed to get image from database");
        return Result.error("Failed to retrieve image", "INTERNAL_SERVER_ERROR");
    }

    if (!dbImage) {
        return Result.error("Image not found", "NOT_FOUND");
    }

    // Refresh signed URL
    const [urlError, refreshedUrl] = await to(() =>
        getSignedUrl(
            s3Client,
            new GetObjectCommand({
                Bucket: BUCKET_NAME,
                Key: dbImage.path,
            }),
            { expiresIn: URL_EXPIRATION_SECONDS }
        )
    );

    if (urlError) {
        logger.error({ error: urlError, id }, "Failed to refresh signed URL");
        return Result.error("Failed to refresh image URL", "INTERNAL_SERVER_ERROR");
    }

    // Update URL in database
    const [updateError, updatedImage] = await to(() =>
        prisma.image.update({
            where: { id },
            data: { url: refreshedUrl },
        })
    );

    if (updateError) {
        logger.error({ error: updateError, id }, "Failed to update image URL in database");
        return Result.error("Failed to update image URL", "INTERNAL_SERVER_ERROR");
    }

    return Result.ok(Image.fromDb(updatedImage));
};

type GetImageSignedUrlProps = {
    id: string;
    expiresIn?: number;
};

const getImageSignedUrl = async (props: GetImageSignedUrlProps): AsyncResultType<string> => {
    const { id, expiresIn = URL_EXPIRATION_SECONDS } = props;

    const [dbError, dbImage] = await to(() =>
        prisma.image.findUnique({
            where: { id },
        })
    );

    if (dbError) {
        logger.error({ error: dbError, id }, "Failed to get image from database");
        return Result.error("Failed to retrieve image", "INTERNAL_SERVER_ERROR");
    }

    if (!dbImage) {
        return Result.error("Image not found", "NOT_FOUND");
    }

    const [urlError, signedUrl] = await to(() =>
        getSignedUrl(
            s3Client,
            new GetObjectCommand({
                Bucket: BUCKET_NAME,
                Key: dbImage.path,
            }),
            { expiresIn }
        )
    );

    if (urlError) {
        logger.error({ error: urlError, id }, "Failed to generate signed URL");
        return Result.error("Failed to generate image URL", "INTERNAL_SERVER_ERROR");
    }

    return Result.ok(signedUrl);
};

/**
 * Get multiple images with pagination and filtering options
 */
type GetImagesProps = {
    collectionId?: string;
    ids?: string[];
    limit?: number;
    offset?: number;
    tags?: string[];
};

const getImages = async (props: GetImagesProps): AsyncResultType<Image[]> => {
    const { collectionId, ids, limit = 50, offset = 0, tags } = props;

    const where: Prisma.ImageWhereInput = {};

    if (isDefined(collectionId)) {
        where.collectionId = collectionId;
    }

    if (isDefined(ids) && ids.length > 0) {
        where.id = { in: ids };
    }

    if (isDefined(tags) && tags.length > 0) {
        where.tags = { hasEvery: tags };
    }

    const [dbError, dbImages] = await to(() =>
        prisma.image.findMany({
            where,
            take: limit,
            skip: offset,
            orderBy: { createdAt: "desc" },
        })
    );

    if (dbError) {
        logger.error({ error: dbError }, "Failed to get images from database");
        return Result.error("Failed to retrieve images", "INTERNAL_SERVER_ERROR");
    }

    const images = dbImages.map(Image.fromDb);
    return Result.ok(images);
};

/**
 * Update image metadata
 */
type UpdateImageProps = {
    id: string;
    originalName?: string;
    tags?: string[];
};

const updateImage = async (props: UpdateImageProps): AsyncResultType<Image> => {
    const { id, originalName, tags } = props;

    const [findError, existingImage] = await to(() =>
        prisma.image.findUnique({
            where: { id },
        })
    );

    if (findError) {
        logger.error({ error: findError, id }, "Failed to find image");
        return Result.error("Failed to verify image", "INTERNAL_SERVER_ERROR");
    }

    if (!existingImage) {
        return Result.error("Image not found", "NOT_FOUND");
    }

    const updateData: Prisma.ImageUpdateInput = {};

    if (isDefined(originalName)) {
        updateData.originalName = originalName;
    }

    if (isDefined(tags)) {
        updateData.tags = tags;
    }

    const [dbError, updatedImage] = await to(() =>
        prisma.image.update({
            where: { id },
            data: updateData,
        })
    );

    if (dbError) {
        logger.error({ error: dbError, id }, "Failed to update image");
        return Result.error("Failed to update image", "INTERNAL_SERVER_ERROR");
    }

    return Result.ok(Image.fromDb(updatedImage));
};

/**
 * Delete an image from R2 and the database
 */
const deleteImage = async (id: string): AsyncResultType<void> => {
    // Find the image to get the path
    const [findError, image] = await to(() =>
        prisma.image.findUnique({
            where: { id },
        })
    );

    if (findError) {
        logger.error({ error: findError, id }, "Failed to find image for deletion");
        return Result.error("Failed to find image", "INTERNAL_SERVER_ERROR");
    }

    if (!image) {
        return Result.error("Image not found", "NOT_FOUND");
    }

    // Delete from R2
    const [r2Error] = await to(() =>
        s3Client.send(
            new DeleteObjectCommand({
                Bucket: BUCKET_NAME,
                Key: image.path,
            })
        )
    );

    if (r2Error) {
        logger.error({ error: r2Error, id, path: image.path }, "Failed to delete image from R2");
        // Continue with database deletion even if R2 delete fails
    }

    // Delete from database
    const [dbError] = await to(() =>
        prisma.image.delete({
            where: { id },
        })
    );

    if (dbError) {
        logger.error({ error: dbError, id }, "Failed to delete image from database");
        return Result.error("Failed to delete image metadata", "INTERNAL_SERVER_ERROR");
    }

    return Result.ok(undefined);
};

/**
 * Download image data from R2
 */
const downloadImage = async (id: string): AsyncResultType<Buffer> => {
    // Find the image to get the path
    const [findError, image] = await to(() =>
        prisma.image.findUnique({
            where: { id },
        })
    );

    if (findError) {
        logger.error({ error: findError, id }, "Failed to find image for download");
        return Result.error("Failed to find image", "INTERNAL_SERVER_ERROR");
    }

    if (!image) {
        return Result.error("Image not found", "NOT_FOUND");
    }

    // Download from R2
    const [r2Error, r2Response] = await to(() =>
        s3Client.send(
            new GetObjectCommand({
                Bucket: BUCKET_NAME,
                Key: image.path,
            })
        )
    );

    if (r2Error) {
        logger.error({ error: r2Error, id, path: image.path }, "Failed to download image from R2");
        return Result.error("Failed to download image", "INTERNAL_SERVER_ERROR");
    }

    if (!r2Response.Body) {
        return Result.error("Image body is empty", "INTERNAL_SERVER_ERROR");
    }

    const stream = r2Response.Body as Readable;
    const chunks: Buffer[] = [];

    const [streamError, buffer] = await to(
        () =>
            new Promise<Buffer>((resolve, reject) => {
                stream.on("data", chunk => chunks.push(Buffer.from(chunk)));
                stream.on("error", err => reject(err));
                stream.on("end", () => resolve(Buffer.concat(chunks)));
            })
    );

    if (streamError) {
        logger.error({ error: streamError, id }, "Failed to read image stream");
        return Result.error("Failed to process image data", "INTERNAL_SERVER_ERROR");
    }

    return Result.ok(buffer);
};

export const ImageService = {
    uploadImage,
    getImage,
    getImages,
    updateImage,
    deleteImage,
    getImageSignedUrl,
    downloadImage,
};
