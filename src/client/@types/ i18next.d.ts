import contentType from "@/client/i18n/types";

declare module "i18next" {
    interface CustomTypeOptions {
        resources: typeof contentType;
    }
}
