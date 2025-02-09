import { ColumnDef } from "@tanstack/react-table";

export type Collection = {
    id: string;
    name: string;
    numberOfImages: number;
    date: Date;
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
        header: "Images",
    },
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ getValue }) => {
            const date = getValue() as Date;
            return date.toLocaleDateString("en-GB");
        },
    },
];
