import { ImageGridCarousel } from "@/client/features/collection/components/image-grid-carousel";
import { useParams } from "@tanstack/react-router";

export const CollectionContainer = () => {
    const images: { id: string; src: string; alt: string }[] = [];

    for (let i = 0; i < 20; i++) {
        const image = {
            id: `${i}`,
            src: `https://picsum.photos/400?random=${i}`,
            alt: `Image ${i}`,
        };

        images.push(image);
    }

    const parmas = useParams({ strict: false });

    return <ImageGridCarousel images={images} />;
};
