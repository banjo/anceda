import { Breadcrumbs } from "@/client/components/shared/header/breadcrumbs";
import { UserNav } from "@/client/components/shared/header/user-nav";
import { Separator } from "@/client/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/client/components/ui/sidebar";
import { PropsWithChildren } from "react";

export const Header = ({ children }: PropsWithChildren) => (
    <SidebarInset>
        <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumbs />
            </div>

            <div className="flex items-center gap-2 px-4">
                <UserNav />
            </div>
        </header>
        {children}
    </SidebarInset>
);
