import { includes, invariant } from "@banjoanton/utils";

type CollectionId = string;
type Timestamp = string;
type Id = string;
type SanitizedFilename = string;

export const IMAGE_VARIANTS = ["original", "thumbnail"] as const;
export type ImageVariant = (typeof IMAGE_VARIANTS)[number];

export type ImagePath = `${CollectionId}/${ImageVariant}/${Timestamp}_${Id}_${SanitizedFilename}`;

type CreateImagePathProps = {
    collectionId: CollectionId;
    imageVariant: ImageVariant;
    id: Id;
    filename: string;
};

const sanitizeFilename = (filename: string): string =>
    filename
        .replace(/[/\\:*?"<>|]/g, "") // Remove characters not allowed in filenames
        .replace(/\s+/g, "_") // Replace spaces with underscores
        .replace(/[^\w\-.]/g, "") // Remove any other non-alphanumeric characters except dash and dot
        .trim(); // Remove leading/trailing whitespace

const getTimestamp = (): Timestamp =>
    new Date()
        .toISOString()
        .replace(/[-:]/g, "") // Remove dashes and colons: 20240315T143022.123Z
        .replace("T", "-") // Replace T with dash: 20240315-143022.123Z
        .slice(0, 15); // Take just YYYYMMDD-HHMMSS: 20240315-143022

const create = ({ collectionId, imageVariant, id, filename }: CreateImagePathProps): ImagePath =>
    `${collectionId}/${imageVariant}/${getTimestamp}_${id}_${sanitizeFilename(filename)}`;

type ParseProps = {
    collectionId: CollectionId;
    imageVariant: ImageVariant;
    timestamp: Timestamp;
    id: Id;
    filename: SanitizedFilename;
};

export const parse = (imagePath: ImagePath): ParseProps => {
    const [collectionId, imageVariant, rest] = imagePath.split("/");
    const [timestamp, id, filename] = rest.split("_");

    invariant(includes(IMAGE_VARIANTS, imageVariant), `Invalid image variant: ${imageVariant}`);
    invariant(collectionId && timestamp && id && filename, `Invalid image path: ${imagePath}`);

    return { collectionId, imageVariant, timestamp, id, filename };
};

export const ImagePathUtil = {
    create,
    parse,
};
