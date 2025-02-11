import { ContentDefinition } from "@/client/translations";
import { ContentDefinition } from "@/client/translations";
import { useTranslation } from "react-i18next";
export const Example = () => {
    const { t } = useTranslation();
    return <div>Example</div>;
};
export function Example2() {
    return <div>Example 2</div>;
}
const Conmponent = function () {
    return <div>Example 3</div>;
};
export const content: ContentDefinition = {
    key: "client/i18n/vite-content-generator-plugin",
    tree: {},
};
