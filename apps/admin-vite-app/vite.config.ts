import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    process.env.ANALYZE === "true" &&
      visualizer({
        open: true,
        filename: "dist/stats.html",
        gzipSize: true,
        brotliSize: true,
      }),
  ],
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV ?? "development"),
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@api": fileURLToPath(new URL("../../packages/shared-api/src", import.meta.url)),
      "@ui": fileURLToPath(new URL("../../packages/shared-ui", import.meta.url)),
    },
  },
  server: {
    port: 3001,
  },
});
