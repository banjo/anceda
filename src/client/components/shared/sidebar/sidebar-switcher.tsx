import * as React from "react";
import { SidebarMenu, SidebarMenuItem } from "@/client/components/ui/sidebar";

type TeamSwitcherProps = {
    teams: {
        name: string;
        logo: React.ElementType;
        plan: string;
    }[];
};

export function TeamSwitcher({ teams }: TeamSwitcherProps) {
    const [activeTeam] = React.useState(teams[0]);

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <div className="flex w-full items-center gap-2 p-3 rounded-lg bg-sidebar text-sidebar-foreground">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                        <activeTeam.logo className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{activeTeam.name}</span>
                        <span className="truncate text-xs text-muted-foreground">
                            {activeTeam.plan}
                        </span>
                    </div>
                </div>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
