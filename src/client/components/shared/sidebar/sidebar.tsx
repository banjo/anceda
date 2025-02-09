import {
    SidebarEntry,
    SidebarGroupContainer,
} from "@/client/components/shared/sidebar/sidebar-group-container";
import { TeamSwitcher } from "@/client/components/shared/sidebar/sidebar-switcher";
import { NavUser } from "@/client/components/shared/sidebar/sidebar-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/client/components/ui/sidebar";
import { AudioWaveform, Command, GalleryVerticalEnd, Map, SquareTerminal } from "lucide-react";

// This is sample data.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "Acme Inc",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Acme Corp.",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
        },
    ],
};

export const AppSidebar = ({ ...props }) => {
    const contentEntries: SidebarEntry[] = [
        {
            name: "Overview",
            url: "/dashboard/overview",
            icon: SquareTerminal,
            isCollapsible: false,
        },
        {
            name: "Collections",
            url: "/dashboard/collections",
            icon: GalleryVerticalEnd,
            isCollapsible: false,
        },
        {
            name: "Organization",
            url: "/dashboard/organization",
            icon: Command,
            isCollapsible: false,
            items: [
                { title: "Members", url: "/dashboard/organization/members", icon: Map },
                { title: "Teams", url: "/dashboard/organization/teams" },
            ],
        },
    ];
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroupContainer entries={contentEntries} name="Dashboard" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
};
