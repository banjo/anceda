import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: "esm",
    outDir: "build-api",
    splitting: false,
    sourcemap: false,
    clean: true,
});
