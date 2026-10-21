/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Relative asset paths so `dist/` can be hosted from any sub-folder
  server: {
    host: true,
    allowedHosts: true
  },
});
