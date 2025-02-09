import { Collection, columns } from "@/client/features/collections/components/columns";
import { DataTable } from "@/client/features/collections/components/data-table";

export const CollectionsContainer = () => {
    const collections: Collection[] = [
        {
            id: "123",
            name: "Alliansloppet 2023",
            numberOfImages: 70,
            date: new Date("2023-08-13"),
        },
        {
            id: "456",
            name: "Alliansloppet 2024 ",
            numberOfImages: 100,
            date: new Date("2024-08-20"),
        },
        {
            id: "789",
            name: "Alliansloppet 2022 ",
            numberOfImages: 85,
            date: new Date("2022-08-19"),
        },
    ];

    const collectionsByDate = collections.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={collectionsByDate} />
        </div>
    );
};
