import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/client/components/ui/dropdown-menu";

import { LucideIcon, MoreHorizontal } from "lucide-react";

import { Button } from "@/client/components/ui/button";

export type Action = {
    label: string;
    icon: LucideIcon;
    color?: string;
    // TODO: make action parameter required
    action?: () => void;
};

type ActionsDropdownProps = {
    actions: Action[];
};

export const ActionsDropdown = ({ actions }: ActionsDropdownProps) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {actions.map(action => (
                <DropdownMenuItem
                    className={`flex items-center gap-1 ${action.color || "text-inherit"}`}
                >
                    <action.icon size={15} />
                    {action.label}
                </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
    </DropdownMenu>
);
