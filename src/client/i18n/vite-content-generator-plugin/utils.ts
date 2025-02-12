import { ContentGeneratorOptions } from "@/client/i18n/vite-content-generator-plugin/vite-content-generator-plugin";
import { ContentDefinition } from "@/client/translations";
import fs from "fs/promises";
import ts from "typescript";

export function prependImportToFile(
    sourceFile: ts.SourceFile,
    importStatement: ts.ImportDeclaration
) {
    const updatedSourceFile = ts.factory.updateSourceFile(sourceFile, [
        importStatement,
        ...sourceFile.statements,
    ]);

    return updatedSourceFile;
}

export function createImportDeclaration(
    moduleName: string,
    imports: string[]
): ts.ImportDeclaration {
    const importSpecifiers = imports.map(importName =>
        ts.factory.createImportSpecifier(
            false, // This is not a type-only import
            undefined, // Use undefined to not rename (i.e., no "as XYZ" part)
            ts.factory.createIdentifier(importName) // The name of the import
        )
    );

    const importClause = ts.factory.createImportClause(
        false, // This is not a type-only import
        undefined, // No default import specified
        ts.factory.createNamedImports(importSpecifiers) // Use named imports from the above specifiers
    );

    return ts.factory.createImportDeclaration(
        undefined, // No decorators
        importClause, // No modifiers (e.g., `export`)
        ts.factory.createStringLiteral(moduleName) // The module from which to import
    );
}

export const findImportDeclaration = (
    sourceFile: ts.SourceFile,
    { importModuleTrigger, importSpecifierTrigger }: ContentGeneratorOptions
): boolean => {
    for (const node of sourceFile.statements) {
        if (!ts.isImportDeclaration(node)) continue;

        if (node.moduleSpecifier.getText().includes(importSpecifierTrigger)) {
            const namedImports = node.importClause?.namedBindings;

            if (namedImports && ts.isNamedImports(namedImports)) {
                for (const element of namedImports.elements) {
                    if (element.name.getText() === importModuleTrigger) {
                        return true;
                    }
                }
            }
        }
    }

    return false;
};

export async function saveSourceFile(file: string, sourceFile: ts.SourceFile) {
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    const newContent = printer.printFile(sourceFile);

    const prettier = await import("prettier");

    if (!prettier) {
        await fs.writeFile(file, newContent);
        return;
    }

    const config = await prettier.resolveConfig(file);
    const formattedContent = await prettier.format(newContent, {
        ...config,
        parser: "typescript",
    });

    await fs.writeFile(file, formattedContent);
}

export function appendVariableToSourceFile(
    sourceFile: ts.SourceFile,
    variable: ts.VariableStatement
): ts.SourceFile {
    const updatedSourceFile = ts.factory.updateSourceFile(sourceFile, [
        ...sourceFile.statements,
        variable,
    ]);

    return updatedSourceFile;
}

export function createContentDefinitionNode(
    content: ContentDefinition,
    { variableName, typeName }: Required<ContentGeneratorOptions>
): ts.VariableStatement {
    const variableDeclaration = ts.factory.createVariableDeclaration(
        variableName,
        undefined,
        ts.factory.createTypeReferenceNode(typeName),
        ts.factory.createObjectLiteralExpression(
            [
                ts.factory.createPropertyAssignment(
                    "key",
                    ts.factory.createStringLiteral(content.key)
                ),
                ts.factory.createPropertyAssignment(
                    "tree",
                    ts.factory.createObjectLiteralExpression([], false)
                ),
            ],
            true
        )
    );

    return ts.factory.createVariableStatement(
        ts.factory.createModifiersFromModifierFlags(ts.ModifierFlags.Export),
        ts.factory.createVariableDeclarationList([variableDeclaration], ts.NodeFlags.Const)
    );
}

export function isConstReactComponent(node: ts.Node) {
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
export function findReactComponents(sourceFile: ts.SourceFile): NodeWithName[] {
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

export function parseObjectLiteralExpression(
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

export function findContentDefinition(sourceFile: ts.SourceFile, opts: ContentGeneratorOptions) {
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
