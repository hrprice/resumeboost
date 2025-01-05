import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "tailwindcss";
import svgr from "vite-plugin-svgr";
import * as path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  resolve: {
    alias: [
      {
        find: "@resume-optimizer/ui",
        replacement: path.resolve(__dirname, "./src"),
      },
      {
        find: "@resume-optimizer/shared",
        replacement: path.resolve(__dirname, "../shared"),
      },
    ],
  },
});
