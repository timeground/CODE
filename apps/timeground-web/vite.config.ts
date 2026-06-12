import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const root = path.resolve(__dirname, "../..");

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@timeground/landing": path.resolve(root, "packages/landing/src/index.ts"),
    },
  },
  build: {
    outDir: "dist",
  },
});
