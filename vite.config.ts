import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "generate-200-html",
      closeBundle() {
        const distIndex = path.resolve(__dirname, "dist/index.html");
        const dist200 = path.resolve(__dirname, "dist/200.html");
        if (fs.existsSync(distIndex)) {
          fs.copyFileSync(distIndex, dist200);
        }
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  server: {
    port: 5173,
    host: true,
    open: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
