import { Maybe } from "@banjoanton/utils";
import { Image as DbImage } from "@prisma/client";

export type Image = {
    id: string;
    filename: string;
    originalName: Maybe<string>;
    path: string;
    url: string;
    mimeType: string;
    size: number;
    width: Maybe<number>;
    height: Maybe<number>;
    collectionId: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
};

export const Image = {
    from: (image: Image): Image => image,
    fromDb: (dbImage: DbImage): Image => ({
        id: dbImage.id,
        filename: dbImage.filename,
        originalName: dbImage.originalName ?? undefined,
        path: dbImage.path,
        url: dbImage.url,
        mimeType: dbImage.mimeType,
        size: dbImage.size,
        width: dbImage.width ?? undefined,
        height: dbImage.height ?? undefined,
        collectionId: dbImage.collectionId,
        tags: dbImage.tags,
        createdAt: dbImage.createdAt,
        updatedAt: dbImage.updatedAt,
    }),
};
