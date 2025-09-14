import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      react.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
      importPlugin.configs.recommended,
      prettier,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: {
      react: { version: "detect" }, // React 버전 자동 감지
    },
    rules: {
      // 사용하지 않는 변수 경고, 대문자/언더스코어 변수는 무시 (React 컴포넌트 이름 패턴 대응)
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],

      // import 순서 강제: builtin → external → internal → parent/sibling → index
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling"],
            "index",
          ],
          alphabetize: { order: "asc", caseInsensitive: true },
          "newlines-between": "always",
        },
      ],

      // JSX 스코프 룰 (React 17+는 불필요)
      "react/react-in-jsx-scope": "off",
    },
  },
]);
