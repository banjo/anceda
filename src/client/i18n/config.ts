import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import sv from "./sv.json";
import { Env } from "@/utils/env";

const env = Env.client();

i18next.use(initReactI18next).init({
    lng: "sv",
    debug: !!env.DEV,
    resources: {
        en,
        sv,
    },
});
