import { Collection, columns } from "@/client/features/collections/components/columns";
import { DataTable } from "@/client/features/collections/components/data-table";

export const CollectionsContainer = () => {
    const collections: Collection[] = [
        {
            id: "123",
            name: "Alliansloppet 2023",
            date: new Date("2023-08-13"),
            event: "Alliansloppet",
            images: Array.from({ length: 60 }, (_, i) => ({
                id: `city-${i + 1}`,
                url: `/placeholder.svg?height=80&width=80&text=City${i + 1}`,
                title: `City Image ${i + 1}`,
            })),
        },
        {
            id: "456",
            name: "AO-Loppet 2024",
            date: new Date("2024-08-03"),
            event: "AO-Loppet",
            images: Array.from({ length: 60 }, (_, i) => ({
                id: `city-${i + 1}`,
                url: `/placeholder.svg?height=80&width=80&text=City${i + 1}`,
                title: `City Image ${i + 1}`,
            })),
        },
        {
            id: "789",
            name: "Alliansloppet 2022",
            date: new Date("2022-08-19"),
            event: "Alliansloppet",
            images: Array.from({ length: 60 }, (_, i) => ({
                id: `city-${i + 1}`,
                url: `/placeholder.svg?height=80&width=80&text=City${i + 1}`,
                title: `City Image ${i + 1}`,
            })),
        },
        {
            id: "123",
            name: "AO-Loppet 2023",
            date: new Date("2023-08-20"),
            event: "AO-Loppet",
            images: Array.from({ length: 60 }, (_, i) => ({
                id: `city-${i + 1}`,
                url: `/placeholder.svg?height=80&width=80&text=City${i + 1}`,
                title: `City Image ${i + 1}`,
            })),
        },
        {
            id: "456",
            name: "Alliansloppet 2024",
            date: new Date("2024-08-20"),
            event: "Alliansloppet",
            images: Array.from({ length: 60 }, (_, i) => ({
                id: `city-${i + 1}`,
                url: `/placeholder.svg?height=80&width=80&text=City${i + 1}`,
                title: `City Image ${i + 1}`,
            })),
        },
        {
            id: "789",
            name: "GKN-Stafetten 2022",
            date: new Date("2022-07-05"),
            event: "GKN-Stafetten",
            images: Array.from({ length: 60 }, (_, i) => ({
                id: `city-${i + 1}`,
                url: `/placeholder.svg?height=80&width=80&text=City${i + 1}`,
                title: `City Image ${i + 1}`,
            })),
        },
        {
            id: "123",
            name: "Alliansloppet 2023",
            date: new Date("2023-08-13"),
            event: "Alliansloppet",
            images: Array.from({ length: 60 }, (_, i) => ({
                id: `city-${i + 1}`,
                url: `/placeholder.svg?height=80&width=80&text=City${i + 1}`,
                title: `City Image ${i + 1}`,
            })),
        },
        {
            id: "456",
            name: "GKN-Stafetten 2024",
            date: new Date("2024-06-20"),
            event: "GKN-Stafetten",
            images: Array.from({ length: 60 }, (_, i) => ({
                id: `city-${i + 1}`,
                url: `/placeholder.svg?height=80&width=80&text=City${i + 1}`,
                title: `City Image ${i + 1}`,
            })),
        },
        {
            id: "789",
            name: "Beachhandboll 2024",
            date: new Date("2024-08-19"),
            event: "Beachhandboll",
            images: Array.from({ length: 60 }, (_, i) => ({
                id: `city-${i + 1}`,
                url: `/placeholder.svg?height=80&width=80&text=City${i + 1}`,
                title: `City Image ${i + 1}`,
            })),
        },
    ];

    const collectionsByDate = collections.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={collectionsByDate} />
        </div>
    );
};
