import { Plugin } from "vite";

import { ContentDefinition } from "@/client/translations";
import path from "path";
import ts from "typescript";
import {
    appendVariableToSourceFile,
    createContentDefinitionNode,
    createImportDeclaration,
    findContentDefinition,
    findImportDeclaration,
    prependImportToFile,
    saveSourceFile,
} from "./utils";
import { attempt, attemptSync } from "@banjoanton/utils";

export type ContentGeneratorOptions = {
    variableName: string;
    typeName: string;
    importSpecifierTrigger: string;
    importModuleTrigger: string;
    importSpecifierContent: string;
    importModuleContent: string;
    baseKey: string;
};

const defaultSettings: Required<ContentGeneratorOptions> = {
    variableName: "content",
    typeName: "ContentDefinition",
    importSpecifierTrigger: "react-i18next",
    importModuleTrigger: "useTranslation",
    importSpecifierContent: "@/client/translations",
    importModuleContent: "ContentDefinition",
    baseKey: "example",
};

export const contentGenerator = (opts?: Partial<ContentGeneratorOptions>): Plugin => {
    // @ts-ignore - merge default settings with user settings
    const settings = { ...defaultSettings, ...opts };
    return {
        name: "vite-plugin-watch-tsx",
        async handleHotUpdate({ file, read }) {
            if (path.extname(file) !== ".tsx") return;

            const data = await read();
            if (!data) {
                console.log("No content found in the file");
                return;
            }

            const sourceFile = ts.createSourceFile(file, data, ts.ScriptTarget.Latest, true);

            const importModuleExists = findImportDeclaration(sourceFile, settings);
            if (!importModuleExists) {
                console.log("No import module found");
                return;
            }

            // check if content exists
            let contentDefinition = findContentDefinition(sourceFile, settings);

            if (!contentDefinition) {
                console.log("no definition found, adding...");

                const definition: ContentDefinition = {
                    key: settings.baseKey,
                    tree: {},
                };
                const contentNode = createContentDefinitionNode(definition, settings);
                contentDefinition = definition as ContentDefinition;
                const updated = appendVariableToSourceFile(sourceFile, contentNode);

                const importStatement = createImportDeclaration(settings.importSpecifierContent, [
                    settings.importModuleContent,
                ]);

                const final = prependImportToFile(updated, importStatement);

                await saveSourceFile(file, final);
            }

            // check if added to tree

            // run script to generate locale files
        },
    };
};
