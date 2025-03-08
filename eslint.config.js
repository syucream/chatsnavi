import eslint from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tseslintParser from '@typescript-eslint/parser'
import prettier from 'eslint-config-prettier'

export default [
  {
    ignores: ['.output/**/*', 'dist/**/*', 'node_modules/**/*'],
  },
  eslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        browser: 'readonly',
        chrome: 'readonly',
        document: 'readonly',
        window: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        location: 'readonly',
        URL: 'readonly',
        Location: 'readonly',
        CustomEvent: 'readonly',
        Event: 'readonly',
        WebSocket: 'readonly',
        MutationObserver: 'readonly',
        fetch: 'readonly',
        AbortController: 'readonly',
        InputEvent: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        requestIdleCallback: 'readonly',
        cancelIdleCallback: 'readonly',
        addEventListener: 'readonly',
        removeEventListener: 'readonly',
        defineBackground: 'readonly',
        defineContentScript: 'readonly',
        I18n: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-constant-condition': ['error', { checkLoops: false }],
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },
  prettier,
]
