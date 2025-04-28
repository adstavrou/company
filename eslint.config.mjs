import parser from '@typescript-eslint/parser';
import plugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'apps/**/dist/**',
      'tools/**/dist/**'
    ],
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: parser,
      parserOptions: {
        project: ['./tsconfig.base.json'],
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': plugin,
      'prettier': prettierPlugin
    },
    rules: {
      'prefer-const': 'off',
      'no-var': 'error',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { "argsIgnorePattern": "^_" }],
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { "avoidEscape": true }],
      'prettier/prettier': 'error'
    }
  },
];
