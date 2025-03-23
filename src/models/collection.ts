import { Maybe } from "@banjoanton/utils";
import { CollectionAccess as DbCollectionAccess, Prisma } from "@prisma/client";
import { Image } from "@/models/image";

// TYPES
type DbCollectionWithImageas = Prisma.CollectionGetPayload<{ include: { images: true } }>;

export type CollectionAccess = {
    id: string;
    collectionId: string;
    organizationId: string;
    createdAt: Date;
    updatedAt: Date;
    grantedById: Maybe<string>;
};

type CollectionBase = {
    id: string;
    name: string;
    description: Maybe<string>;
    createdAt: Date;
    updatedAt: Date;
    isPublic: boolean;
};

export type Collection = CollectionBase & {
    images: Image[];
    access?: CollectionAccess[];
};

// FUNCTIONS
const from = (collection: Collection): Collection => collection;

const fromDb = (dbCollection: DbCollectionWithImageas): Collection => ({
    id: dbCollection.id,
    name: dbCollection.name,
    description: dbCollection.description ?? undefined,
    createdAt: dbCollection.createdAt,
    updatedAt: dbCollection.updatedAt,
    isPublic: dbCollection.isPublic,
    images: dbCollection.images.map(Image.fromDb),
});

const accessFromDb = (dbAccess: DbCollectionAccess): CollectionAccess => ({
    id: dbAccess.id,
    collectionId: dbAccess.collectionId,
    organizationId: dbAccess.organizationId,
    createdAt: dbAccess.createdAt,
    updatedAt: dbAccess.updatedAt,
    grantedById: dbAccess.grantedById ?? undefined,
});

export const Collection = { from, fromDb, accessFromDb };
