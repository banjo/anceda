import { SidebarCollapsibleEntry } from "@/client/components/shared/sidebar/sidebar-collapsible-entry";
import { SidebarSimpleEntry } from "@/client/components/shared/sidebar/sidebar-simple-entry";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu } from "@/client/components/ui/sidebar";

export type SidebarEntry = SidebarSimpleEntry | SidebarCollapsibleEntry;

type SidebarGroupContainerProps = {
    name: string;
    entries: SidebarEntry[];
};
export const SidebarGroupContainer = ({ entries, name }: SidebarGroupContainerProps) => (
    <SidebarGroup>
        <SidebarGroupLabel>{name}</SidebarGroupLabel>
        <SidebarMenu>
            {entries.map(entry => {
                if (entry.isCollapsible) {
                    return <SidebarCollapsibleEntry key={entry.title} {...entry} />;
                }
                return <SidebarSimpleEntry key={entry.name} entry={entry} />;
            })}
        </SidebarMenu>
    </SidebarGroup>
);
