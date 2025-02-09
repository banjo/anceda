import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/client/components/ui/collapsible";
import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/client/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { ChevronRight, type LucideIcon } from "lucide-react";

type CollapsibleItemChild = {
    title: string;
    url: string;
};

export type SidebarCollapsibleEntry = {
    title: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: CollapsibleItemChild[];
    isCollapsible: true;
};

export const SidebarCollapsibleEntry = (item: SidebarCollapsibleEntry) => {
    const { title, isActive, icon: Icon, items } = item;
    return (
        <Collapsible key={title} asChild defaultOpen={isActive} className="group/collapsible">
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={title}>
                        {Icon ? <Icon /> : null}
                        <span>{title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {items?.map(subItem => (
                            <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                    <Link to={subItem.url}>
                                        <span>{subItem.title}</span>
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
};
