import { ScrollArea } from "@/client/components/ui/scroll-area";
import React from "react";

type PageContainerProps = {
    children: React.ReactNode;
    scrollable?: boolean;
};

export default function PageContainer({ children, scrollable = true }: PageContainerProps) {
    const container = () => <div className="flex flex-1 p-4 md:px-6">{children}</div>;

    return scrollable ? (
        <ScrollArea className="h-[calc(100dvh-52px)]">{container()}</ScrollArea>
    ) : (
        container()
    );
}
