import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [
        tsconfigPaths(),
        TanStackRouterVite({
            routesDirectory: "./src/client/routes/",
            generatedRouteTree: "./src/client/routeTree.gen.ts",
        }),
        viteReact(),
    ],
    build: {
        outDir: "build-web",
    },
});
