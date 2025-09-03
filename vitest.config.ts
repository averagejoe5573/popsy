/// <reference types="vitest" />

import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,          // allows using describe/it/expect without imports
        environment: "node",    // CLI + fs heavy, so we stick with Node env
        include: ["tests/**/*.test.ts"],
        coverage: {
            reporter: ["text", "html"],
        },
    },
});
