import { Collection, columns } from "@/client/features/collections/components/columns";
import { DataTable } from "@/client/features/collections/components/data-table";

export const CollectionsContainer = () => {
    const collections: Collection[] = [
        {
            id: "123",
            name: "Alliansloppet 2023",
            numberOfImages: 70,
            date: new Date("2023-08-13"),
            event: "Alliansloppet",
        },
        {
            id: "456",
            name: "AO-Loppet 2024",
            numberOfImages: 100,
            date: new Date("2024-08-03"),
            event: "AO-Loppet",
        },
        {
            id: "789",
            name: "Alliansloppet 2022",
            numberOfImages: 85,
            date: new Date("2022-08-19"),
            event: "Alliansloppet",
        },
        {
            id: "123",
            name: "AO-Loppet 2023",
            numberOfImages: 70,
            date: new Date("2023-08-20"),
            event: "AO-Loppet",
        },
        {
            id: "456",
            name: "Alliansloppet 2024",
            numberOfImages: 50,
            date: new Date("2024-08-20"),
            event: "Alliansloppet",
        },
        {
            id: "789",
            name: "GKN-Stafetten 2022",
            numberOfImages: 85,
            date: new Date("2022-07-05"),
            event: "GKN-Stafetten",
        },
        {
            id: "123",
            name: "Alliansloppet 2023",
            numberOfImages: 70,
            date: new Date("2023-08-13"),
            event: "Alliansloppet",
        },
        {
            id: "456",
            name: "GKN-Stafetten 2024",
            numberOfImages: 55,
            date: new Date("2024-06-20"),
            event: "GKN-Stafetten",
        },
        {
            id: "789",
            name: "Beachhandboll 2024",
            numberOfImages: 60,
            date: new Date("2024-08-19"),
            event: "Beachhandboll",
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
