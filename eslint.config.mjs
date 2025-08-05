import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

// Convert __filename and __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// FlatCompat helps use old-style ESLint configs like "next/core-web-vitals"
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Load the unused-imports plugin dynamically
const unusedImports = (await import("eslint-plugin-unused-imports")).default;

// Final config array
const eslintConfig = [
  // Extend Next.js + TypeScript ESLint rules
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Add custom rules and plugins
  {
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "react/no-unescaped-entities": "off",

      // Unused imports detection
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
];

export default eslintConfig;
