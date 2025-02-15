import { LucideProps } from "lucide-react";
import { FC } from "react";

export type IconType = FC<
    LucideProps & {
        disabled?: boolean;
    }
>;
export type IconSize = "xs" | "sm" | "md" | "lg";

export const iconSizeMapper: Record<IconSize, string> = {
    xs: "h-4 w-4",
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
};
