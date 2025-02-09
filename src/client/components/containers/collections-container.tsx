import { Collection, columns } from "@/client/components/shared/collections/columns";
import { DataTable } from "@/client/components/shared/collections/data-table";

export const CollectionsContainer = () => {
    const collections: Collection[] = [
        {
            id: "123",
            name: "Alliansloppet 2023",
            numberOfImages: 200,
        },
        {
            id: "456",
            name: "Alliansloppet 2024 ",
            numberOfImages: 175,
        },
    ];

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={collections} />
        </div>
    );
};
