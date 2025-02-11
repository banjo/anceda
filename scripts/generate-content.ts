import { ContentTree, Language, languageContent, Languages } from "@/client/translations";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

type JsonObj = Record<string, unknown>;

const isLeafNode = (node: unknown): node is Record<Language, string> =>
    node !== null && typeof node === "object" && "en" in node && "sv" in node;

const format = (json: JsonObj): JsonObj => ({
    translation: json,
});

const extractLanguage = (langTree: ContentTree, lang: Language): JsonObj => {
    const result: JsonObj = {};

    for (const key in langTree) {
        const value = langTree[key];

        if (isLeafNode(value)) {
            result[key] = value[lang];
        } else {
            result[key] = extractLanguage(value, lang);
        }
    }

    return result;
};

const save = async (json: JsonObj, lang: Language) => {
    const dir = path.join(__dirname, "..", "src", "client", "i18n");
    const file = path.join(dir, `${lang}.json`);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(file, JSON.stringify(json, null, 4));
};

console.log("Generating language files...");
for (const lang of Object.keys(Languages)) {
    console.log(`Generating ${lang}.json`);
    const langCode = lang as Language;
    const json = extractLanguage(languageContent, langCode);
    await save(format(json), langCode);
}
console.log("Done!\n");
