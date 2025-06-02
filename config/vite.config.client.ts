// filepath: vite.config.client.ts
import preact from "@preact/preset-vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [preact()],
  build: {
    outDir: "dist/client",
    rollupOptions: {
      input: "./index.html",
    },
  },
});
