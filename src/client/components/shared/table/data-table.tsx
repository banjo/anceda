import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/client/components/ui/table";

import { Button } from "@/client/components/ui/button";
import { LucideIcon } from "lucide-react";

import { useState } from "react";
import { SelectByCategory } from "@/client/components/shared/table/select-by-category";

export type Filter<TData> = {
    selectFilter: (data: TData) => string;
    columnId: keyof TData;
    placeholder?: string;
};

export type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    filters?: Filter<TData>[];
    hideColumns?: { [columnId: string]: false };
    topButton?: {
        label: string;
        // TODO: make handleClick required
        handleClick?: () => void;
        icon: LucideIcon;
    };
};

export function DataTable<TData, TValue>({
    columns,
    data,
    filters,
    hideColumns,
    topButton,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 5,
            },
            columnVisibility: hideColumns,
        },
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    });

    return (
        <div className="w-full h-[80vh]">
            <div className="flex items-center justify-between py-4 gap-2">
                {filters?.map(filter => {
                    const categories = Array.from(new Set(data.map(filter.selectFilter)));
                    return (
                        <div key={filter.columnId.toString()} className="max-w-44">
                            <SelectByCategory
                                key={filter.columnId.toString()}
                                table={table}
                                categories={categories}
                                columnId={filter.columnId.toString()}
                                placeholder={filter.placeholder}
                            />
                        </div>
                    );
                })}
                {topButton ? (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={topButton.handleClick}
                        disabled={!topButton.handleClick}
                    >
                        <topButton.icon /> {topButton.label}
                    </Button>
                ) : null}
            </div>
            <div className="rounded-md border overflow-y-auto">
                <div className="max-h-[65vh]">
                    <Table className="relative">
                        <TableHeader
                            style={{ boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.1)" }}
                            className="sticky top-0 bg-white z-20"
                        >
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map(row => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map(cell => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
