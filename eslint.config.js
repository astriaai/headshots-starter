const typescript = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const prettier = require('eslint-config-prettier');
const eslintPluginPrettier = require('eslint-plugin-prettier');

module.exports = [
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': typescript,
      prettier: eslintPluginPrettier,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      'arca/no-default-export': 'off',
      'promise/param-names': 'off',
      'prettier/prettier': 'error',
      ...typescript.configs['recommended'].rules,
      ...prettier.rules,
    },
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    ...prettier,
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
];
