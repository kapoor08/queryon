// vite.config.ts - FIXED VERSION
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
      name: "QueryonChatWidget",
      fileName: (format) => {
        if (format === "umd") return "chat-widget.js";
        return `index.${format}.js`;
      },
      formats: ["umd", "es"],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        // Remove conflicting output configurations
      },
    },
    // Ensure CSS is inlined
    cssCodeSplit: false,
    // Target modern browsers for better performance
    target: "es2015",
    // Disable minification for debugging
    minify: false,
    // Generate source maps for debugging
    sourcemap: true,
    // Optimize for size
    reportCompressedSize: true,
  },
  base: "/",
});
