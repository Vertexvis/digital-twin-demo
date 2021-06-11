module.exports = {
  env: { browser: true, es2021: true, node: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "react", "simple-import-sort"],
  rules: {
    "no-await-in-loop": "warn",
    "no-return-await": "warn",
    "react/react-in-jsx-scope": "off",
    "react-hooks/rules-of-hooks": "error",
    "require-await": "warn",
    "simple-import-sort/imports": "warn",
  },
  settings: { react: { version: "detect" } },
};
