import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/client/components/ui/select";
import { Table } from "@tanstack/react-table";

type SelectByCategoryProps<TData> = {
    table: Table<TData>;
    categories: string[];
    columnId: string;
    placeholder?: string;
};

export const SelectByCategory = <TData,>({
    table,
    categories,
    columnId,
    placeholder,
}: SelectByCategoryProps<TData>) => (
    <Select
        onValueChange={value => table.getColumn(columnId)?.setFilterValue(value)}
        value={(table.getColumn(columnId)?.getFilterValue() as string) ?? ""}
    >
        <SelectTrigger className="max-w-sm">
            <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value=" ">All</SelectItem>
            {categories.map(category => (
                <SelectItem key={category} value={category}>
                    {category}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
);
