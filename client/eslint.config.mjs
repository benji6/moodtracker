// @ts-check

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import jsxA11y from "eslint-plugin-jsx-a11y";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginCypress from "eslint-plugin-cypress/flat";

export default tseslint.config(
  { ignores: ["dist"] },
  js.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  // TODO: add react-hooks here when it is supported https://github.com/facebook/react/issues/28313
  jsxA11y.flatConfigs.recommended,
  eslintConfigPrettier,
  pluginCypress.configs.recommended,
);
