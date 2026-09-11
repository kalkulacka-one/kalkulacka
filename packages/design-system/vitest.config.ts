import react from "@vitejs/plugin-react";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    exclude: [...configDefaults.exclude, "**/dist/**"],
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitestSetup.ts",
  },
});
