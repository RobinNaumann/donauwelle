// filepath: vite.config.server.ts
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist/server",
    ssr: true,
    rollupOptions: {
      input: "./src/app.server.ts",
    },
  },
});
