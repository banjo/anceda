import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/client/components/ui/carousel";
import { Checkbox } from "@/client/components/ui/checkbox";

type ImageItem = {
    id: string;
    src: string;
    alt: string;
};

export type ImageGridCarouselProps = {
    images: ImageItem[];
};

const IMAGES_PER_PAGE = 12;

export function ImageGridCarousel({ images }: ImageGridCarouselProps) {
    const totalPages = Math.ceil(images.length / IMAGES_PER_PAGE);
    const pages = Array.from({ length: totalPages }, (_, i) =>
        images.slice(i * IMAGES_PER_PAGE, (i + 1) * IMAGES_PER_PAGE)
    );

    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            <Carousel className="w-full">
                <CarouselContent>
                    {pages.map((pageImages, pageIndex) => (
                        <CarouselItem key={pageIndex}>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
                                {pageImages.map(image => (
                                    <div key={image.id} className="relative aspect-square">
                                        <img
                                            src={image.src || "/placeholder.svg"}
                                            alt={image.alt}
                                            className="object-cover w-40 h-40 rounded-md cursor-pointer border"
                                        />
                                        <Checkbox className="absolute top-2 left-2 z-10" />
                                    </div>
                                ))}
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
}
