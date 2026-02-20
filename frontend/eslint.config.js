import { defineConfig } from "eslint/config";
import globals from "globals";
import parser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import shopify from "@shopify/eslint-plugin";
import tslint from "typescript-eslint";

const config = defineConfig([
  {
    ignores: [".next/**", "node_modules/**", ".git/**", "src/generated/**", "next-env.d.ts"],
  },
  {
    files: ["./src/**/*.{tsx,ts}", "./*.ts"],
    languageOptions: {
      parser,
      globals: {
        ...globals.browser,
        ...globals.node,
        React: "readonly",
      },
    },
  },
  {
    files: ["./src/**/*.{tsx,ts}"],
    ...react.configs.flat.recommended,
    rules: {
      "react/react-in-jsx-scope": "off",
    },
  },
  {
    files: ["./src/**/*.{tsx,ts}"],
    ...reactHooks.configs["recommended-latest"],
  },
  {
    files: ["./src/**/*.{tsx,ts}", "./*.ts"],
    ...tslint.configs.recommended[0],
  },
  {
    files: ["./src/**/*.{tsx,ts}", "./*.ts"],
    ...shopify.configs.esnext[0],
  },
  {
    files: ["./src/**/*.{tsx,ts}", "./*.ts"],
    rules: {
      "no-console": "warn",
      camelcase: "off",
      eqeqeq: "off",
      "no-alert": "off",
      "no-use-before-define": "warn",
      curly: "off",
      "no-use-before-define": "off",
      "no-unused-vars": "warn",
      "consistent-return": "warn",
      "no-negated-condition": "error",
      "@shopify/binary-assignment-parens": "off",
      "no-redeclare": "off",
      "no-warning-comments": "warn",
      "id-length": "off",
      "no-process-env": "off",
      "no-nested-ternary": "off",
    },
  },
]);

export default config;
