import { Plugin } from "vite";

import fs from "fs/promises";
import path from "path";
import ts from "typescript";

type ContentGeneratorSettings = {
    variableName: string;
    typeName: string;
};

const defaultSettings: ContentGeneratorSettings = {
    variableName: "content",
    typeName: "ContentDefinition",
};

export const contentGenerator = (opts?: ContentGeneratorSettings): Plugin => {
    const settings = { ...defaultSettings, ...opts };
    return {
        name: "vite-plugin-watch-tsx",
        async handleHotUpdate({ file }) {
            if (path.extname(file) !== ".tsx") return;

            try {
                const data = await fs.readFile(file, "utf8");
                if (!data) {
                    console.log("No content found in the file");
                    return;
                }

                const sourceFile = ts.createSourceFile(file, data, ts.ScriptTarget.Latest, true);
                const components = findReactComponents(sourceFile);

                if (components.length === 0) {
                    console.log("No react components");
                    return;
                }

                const def = findContentDefinition(sourceFile, settings);

                if (!def) {
                    console.log("no definition found");
                    return;
                }

                console.log("Content found:", def.key);
            } catch (err) {
                console.error("Error processing file:", err);
            }
        },
    };
};

function isConstReactComponent(node: ts.Node) {
    return (
        ts.isVariableStatement(node) &&
        node.declarationList.declarations.some(decl => {
            const init = decl?.initializer;
            if (!init) {
                return false;
            }

            if (ts.isArrowFunction(init) || ts.isFunctionExpression(init)) {
                return true;
            }

            return false;
        })
    );
}

type NodeWithName = {
    name: string;
    node: ts.Node;
};
function findReactComponents(sourceFile: ts.SourceFile): NodeWithName[] {
    const components: NodeWithName[] = [];

    const checkAndRecordComponent = (node: ts.Node) => {
        if (
            ts.isFunctionDeclaration(node) ||
            ts.isFunctionExpression(node) ||
            isConstReactComponent(node)
        ) {
            let componentName = "";

            if (ts.isFunctionDeclaration(node) && node.name) {
                componentName = node.name.text;
            } else if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
                componentName = node.name.text;
            } else if (isConstReactComponent(node) && ts.isVariableStatement(node)) {
                componentName = node.declarationList.declarations[0].name.getText();
            }

            if (componentName) {
                components.push({ name: componentName, node });
            }
        }
    };

    ts.forEachChild(sourceFile, node => {
        checkAndRecordComponent(node);
    });

    return components;
}

// function findReactComponentsUsingHook(sourceFile: ts.SourceFile, hookName: string): string[] {
//     const reactComponents: string[] = [];
//
//     const checkAndRecordHookUsage = (node: ts.Node): void => {
//         // Check if this is a JSX expression or function component
//         // log name of the node
//
//         // console.log({
//         //     text: node.getText(),
//         //     isVariableStatement: ts.isVariableStatement(node),
//         //     isFunction: ts.isFunctionDeclaration(node),
//         //     isVariable: ts.isVariableDeclaration(node),
//         //     isFuncExpr: ts.isFunctionExpression(node),
//         //     // isFunction: ts.isFunctionExpression(),
//         // });
//         if (ts.isVariableStatement(node)) {
//             // Check each variable within the variable statement
//             for (const declaration of node.declarationList.declarations) {
//                 if (!declaration.initializer) continue;
//
//                 console.log({
//                     text: declaration.getText(),
//                     // Check if the initializer of the variable is a function expression or arrow function
//                     isFuncExpr:
//                         ts.isArrowFunction(declaration.initializer) ||
//                         ts.isFunctionExpression(declaration.initializer),
//                 });
//             }
//         }
//
//         // if (
//         //     ts.isFunctionDeclaration(node) ||
//         //     (ts.isVariableDeclaration(node) &&
//         //         node.initializer &&
//         //         ts.isArrowFunction(node.initializer)) ||
//         //     ts.isFunctionExpression(node)
//         // ) {
//         //     let usesHook = false;
//         //     let componentName = "";
//         //
//         //     // Retrieve component name if it's directly a function or from the variable declaration
//         //     if (ts.isFunctionDeclaration(node) && node.name) {
//         //         componentName = node.name.text;
//         //     } else if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
//         //         componentName = node.name.text;
//         //     }
//         //
//         //     // Traverse the function body to find hook usage
//         //     ts.forEachChild(node, function visit(child) {
//         //         if (
//         //             ts.isCallExpression(child) &&
//         //             ts.isIdentifier(child.expression) &&
//         //             child.expression.text === hookName
//         //         ) {
//         //             usesHook = true;
//         //         }
//         //         ts.forEachChild(child, visit);
//         //     });
//         //
//         //     if (usesHook && componentName) {
//         //         reactComponents.push(componentName);
//         //     }
//         // }
//     };
//
//     // Traverse the AST
//     ts.forEachChild(sourceFile, node => {
//         checkAndRecordHookUsage(node);
//     });
//
//     return reactComponents;
// }

function parseObjectLiteralExpression(
    expression: ts.ObjectLiteralExpression
): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    expression.properties.forEach(prop => {
        // Only process properties that are directly assignable
        if (ts.isPropertyAssignment(prop)) {
            const key = prop.name.getText();
            const value = prop.initializer;

            // Check the type of initializer and handle accordingly
            if (ts.isStringLiteral(value)) {
                result[key] = value.text;
            } else if (ts.isNumericLiteral(value)) {
                result[key] = +value.text;
            } else if (ts.isArrayLiteralExpression(value)) {
                result[key] = value.elements.map(element => element.getText()); // Simpler array handling, need enhancement for complex cases
            } else if (ts.isObjectLiteralExpression(value)) {
                result[key] = parseObjectLiteralExpression(value); // Recursion for nested objects
            } else {
                result[key] = value.getText(); // Fallback handling, might need more specific handling
            }
        }
    });
    return result;
}

function findContentDefinition(sourceFile: ts.SourceFile, opts: ContentGeneratorSettings) {
    const { variableName, typeName } = opts;
    let result: Record<string, unknown> | undefined = undefined;

    for (const node of sourceFile.statements) {
        if (!ts.isVariableStatement(node)) continue;

        for (const decl of node.declarationList.declarations) {
            if (decl.name.getText() !== variableName || !decl.initializer) continue;

            // Check if the type annotation exists and matches the type
            if (
                decl.type &&
                ts.isTypeReferenceNode(decl.type) &&
                decl.type.typeName.getText() === typeName
            ) {
                // Assuming the initializer is an object literal expression
                if (ts.isObjectLiteralExpression(decl.initializer)) {
                    result = parseObjectLiteralExpression(decl.initializer);

                    break;
                }
            }
        }

        if (result) break;
    }

    return result;
}
