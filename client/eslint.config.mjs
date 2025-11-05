// @ts-check

import eslintConfigPrettier from "eslint-config-prettier";
import js from "@eslint/js";
import jsxA11y from "eslint-plugin-jsx-a11y";
import pluginCypress from "eslint-plugin-cypress/flat";
import reactHooks from "eslint-plugin-react-hooks";
import reactPlugin from "eslint-plugin-react";
import tseslint from "typescript-eslint";

export default [
  { ignores: ["dist"] },
  js.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  reactHooks.configs.flat.recommended,
  jsxA11y.flatConfigs.recommended,
  eslintConfigPrettier,
  pluginCypress.configs.recommended,
  { settings: { react: { version: "detect" } } },
];
