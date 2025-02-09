import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/client/components/ui/dropdown-menu";
import {
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/client/components/ui/sidebar";
import { isDefined, isEmpty } from "@banjoanton/utils";
import { Link } from "@tanstack/react-router";
import { type LucideIcon, MoreHorizontal } from "lucide-react";

export type SidebarSimpleEntrySubItem = {
    title: string;
    url: string;
    icon?: LucideIcon;
};

export type SidebarSimpleEntry = {
    name: string;
    url: string;
    icon: LucideIcon;
    items?: SidebarSimpleEntrySubItem[];
    isCollapsible: false;
};

export type SidebarSimpleEntryProps = {
    entry: SidebarSimpleEntry;
};

export const SidebarSimpleEntry = ({ entry }: SidebarSimpleEntryProps) => {
    const { isMobile } = useSidebar();
    const { name, url, items: subItems } = entry;
    const showSubItems = isDefined(subItems) && !isEmpty(subItems);
    return (
        <SidebarMenuItem key={name}>
            <SidebarMenuButton asChild>
                <Link to={url}>
                    <entry.icon />
                    <span>{name}</span>
                </Link>
            </SidebarMenuButton>
            {!isEmpty(subItems) && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuAction showOnHover>
                            <MoreHorizontal />
                            <span className="sr-only">More</span>
                        </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-48 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align={isMobile ? "end" : "start"}
                    >
                        {showSubItems
                            ? subItems.map(({ title, url: subUrl, icon: SubIcon }) => (
                                  <DropdownMenuItem key={title}>
                                      <div className="flex gap-2 justify-center items-center">
                                          {SubIcon ? <SubIcon /> : <div className="w-6" />}
                                          <Link to={subUrl}>{title}</Link>
                                      </div>
                                  </DropdownMenuItem>
                              ))
                            : null}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </SidebarMenuItem>
    );
};
