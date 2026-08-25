import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Resolve o alias "@/*" nativamente a partir de tsconfig.json — sem
    // depender de um plugin extra.
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    // Testes unitários/integração ficam ao lado do código-fonte
    // (*.test.ts(x)). Testes E2E vivem em e2e/ e rodam via Playwright,
    // não via Vitest — ver docs/TESTING.md.
    include: ["{app,components,lib}/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["app/**", "components/**", "lib/**"],
      exclude: ["**/*.test.{ts,tsx}"],
    },
  },
});
