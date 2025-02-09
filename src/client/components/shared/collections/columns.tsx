import { ColumnDef } from "@tanstack/react-table";

export type Collection = {
    id: string;
    name: string;
    numberOfImages: number;
};

export const columns: ColumnDef<Collection>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "numberOfImages",
        header: "Number of Images",
    },
];
