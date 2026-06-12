import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import electron from "vite-plugin-electron/simple";

const root = path.resolve(__dirname, "../..");

export default defineConfig({
  plugins: [
    react(),
    electron({
      main: { entry: "electron/main.ts" },
      preload: { input: "electron/preload.ts" },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@timeground/model-registry": path.resolve(root, "packages/model-registry/src/index.ts"),
      "@timeground/ai-router": path.resolve(root, "packages/ai-router/src/index.ts"),
      "@timeground/agent-core": path.resolve(root, "packages/agent-core/src/index.ts"),
      "@timeground/landing": path.resolve(root, "packages/landing/src/index.ts"),
    },
  },
  build: {
    outDir: "dist",
  },
});
