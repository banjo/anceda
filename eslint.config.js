import defaultConfig from "@banjoanton/eslint-config";

export default [
    {
        ignores: ["eslint.config.js", "node_modules", "build*", "dist*"],
    },
    ...defaultConfig,
    {
        rules: {
            "@typescript-eslint/no-empty-object-type": "off",
            "react/forbid-component-props": "off",
            "no-redeclare": "off",
        },
    },
];
