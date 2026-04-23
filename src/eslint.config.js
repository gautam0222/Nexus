import { fixupConfigRules } from '@eslint/compat'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
})

export default [
  {
    ignores: ['dist', '.eslintrc.json'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
  },
  ...fixupConfigRules(
    compat.config({
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
      ],
      env: {
        browser: true,
        es2020: true,
      },
      parser: '@typescript-eslint/parser',
      rules: {
        '@typescript-eslint/no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_' },
        ],
        '@typescript-eslint/no-explicit-any': 'warn',
      },
    }),
  ),
  {
    plugins: {
      'react-refresh': reactRefresh.default ?? reactRefresh,
    },
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
