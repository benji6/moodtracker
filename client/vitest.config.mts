import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    testTimeout: 1e4,
    coverage: {
      include: ["src/**/*.{ts,tsx}"],
    },
  },
});
