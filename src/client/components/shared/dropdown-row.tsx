import { FC, ReactNode } from "react";
import { ResponsiveIcon } from "./responsive-icon";
import { IconType } from "@/client/components/models/icon";

type Props = {
    icon: IconType;
    text: ReactNode;
};

export const DropdownRow: FC<Props> = ({ icon, text }) => (
    <div className="flex items-center">
        <ResponsiveIcon Icon={icon} enableTooltip={false} size="xs" />
        <span className="ml-2">{text}</span>
    </div>
);
