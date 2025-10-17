import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable all rules
      "@next/next/no-img-element": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      // Add more specific rules as needed, or use the nuclear option below
    },
  },
  // Nuclear option: disable everything
  {
    files: ["**/*"],
    rules: Object.fromEntries(
      Object.keys({
        ...require("@eslint/js").configs.all.rules,
        ...require("@typescript-eslint/eslint-plugin").configs.all.rules,
      }).map(rule => [rule, "off"])
    ),
  },
];

export default eslintConfig;
