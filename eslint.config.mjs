import eslint from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.ts", "**/*.js"],
    languageOptions: {
      parser: tsparser,
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        window: "readonly",
        require: "readonly",
        module: "readonly",
        __dirname: "readonly",
        console: "readonly",
        Promise: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...eslint.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      "no-undef": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];
