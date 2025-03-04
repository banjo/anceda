import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Download, Search, Trash2 } from "lucide-react";

import { Button } from "@/client/components/ui/button";
import { Checkbox } from "@/client/components/ui/checkbox";

import { ActionsDropdown } from "@/client/components/shared/table/actions-dropdown";

export type Image = {
    id: string;
    url: string;
    title: string;
};

export type Collection = {
    id: string;
    name: string;
    date: Date;
    event: string;
    images: Image[];
};

export const columns: ColumnDef<Collection>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllRowsSelected() ||
                    (table.getIsSomeRowsSelected() && "indeterminate")
                }
                onCheckedChange={value => table.toggleAllRowsSelected(!!value)}
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={value => row.toggleSelected(!!value)}
            />
        ),
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => <div className="w-[150px] truncate"> {row.getValue("name")} </div>,
    },
    {
        id: "images",
        header: "Images",
        cell: ({ row }) => {
            const collection = row.original;

            return (
                <div className="relative w-24 h-24">
                    {collection.images.slice(0, 3).map((image, index) => (
                        <img
                            key={image.id}
                            src={image.url || "/placeholder.svg"}
                            alt={image.title}
                            className="absolute w-20 h-20 object-cover rounded border-2 border-white shadow-md transition-all duration-200 ease-in-out bg-white"
                            style={{
                                top: `${index * 4}px`,
                                left: `${index * 4}px`,
                                zIndex: 3 - index,
                            }}
                            title={image.title}
                        />
                    ))}
                    {collection.images.length > 3 && (
                        <div className="absolute bottom-0 right-0 bg-gray-800 text-white px-2 py-1 rounded-full text-xs z-10">
                            +{collection.images.length - 3}
                        </div>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "date",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ getValue }) => {
            const date = getValue() as Date;
            return date.toLocaleDateString("en-GB");
        },
    },
    {
        id: "event",
        accessorKey: "event",
    },
    {
        id: "action",
        cell: () => (
            <ActionsDropdown
                actions={[
                    { label: "Browse", icon: Search },
                    { label: "Download", icon: Download },
                    { label: "Delete", icon: Trash2, color: "text-red-500" },
                ]}
            />
        ),
        size: 40,
        enableResizing: false,
    },
];
