import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@assets": path.join(__dirname, "src/assets/"),
      "@components": path.join(__dirname, "src/components/"),
      "@pages": path.join(__dirname, "src/pages/"),
      "@tools": path.join(__dirname, "src/tools/"),
      "@static": path.join(__dirname, "src/static/"),
    },
  },
});
