import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env": {
      NODE_ENV: "production",
    },
  },
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "@": path.resolve(path.join(__dirname, "src")),
    },
  },
  build: {
    lib: {
      entry: path.resolve(path.join(__dirname, "src", "index.ts")),
      name: "ChatWidget",
      fileName: (format) => `index.${format}.js`,
    },
  },
  base: "/",
});
