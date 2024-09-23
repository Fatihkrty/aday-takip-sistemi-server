/**
 *  @type {import('eslint').ESLint.ConfigData}
 */
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'perfectionist', 'unused-imports'],
  extends: ['plugin:@typescript-eslint/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [
    '.eslintrc.js',

    'build/*',
    'dist/*',
    'public/*',
    '**/out/*',
    '**/.next/*',
    '**/node_modules/*',

    '**/reportWebVitals.*',
    '**/service-worker.*',
    '**/serviceWorkerRegistration.*',
    '**/setupTests.*',

    '**/.eslintrc.*',

    '**/.prettier.*',
    '**/prettier.config.*',

    '**/next.config.*',

    '**/vite.config.*',

    '**/postcss.config.*',
    '**/tailwind.config.*',

    '**/craco.config.*',
    '**/jsconfig.json',
  ],
  root: true,
  rules: {
    // general
    'no-alert': 0,
    camelcase: 0,
    'no-console': 0,
    'no-unused-vars': 0,
    'no-nested-ternary': 0,
    'no-param-reassign': 0,
    'no-underscore-dangle': 0,
    'no-restricted-exports': 0,
    'no-promise-executor-return': 0,
    'import/prefer-default-export': 0,
    'prefer-destructuring': [1, { object: true, array: false }],
    // typescript
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/naming-convention': 0,
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/consistent-type-exports': 1,
    '@typescript-eslint/consistent-type-imports': 1,
    '@typescript-eslint/no-unused-vars': [1, { args: 'none' }],
    // unused imports
    'unused-imports/no-unused-imports': 1,
    'unused-imports/no-unused-vars': [
      0,
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
    ],
    'perfectionist/sort-named-imports': [
      'warn',
      {
        order: 'asc',
        type: 'line-length',
      },
    ],
    'perfectionist/sort-named-exports': [
      'warn',
      {
        order: 'asc',
        type: 'line-length',
      },
    ],
    'perfectionist/sort-exports': [
      'warn',
      {
        order: 'asc',
        type: 'line-length',
      },
    ],
    'perfectionist/sort-imports': [
      'warn',
      {
        order: 'asc',
        type: 'line-length',
        'newlines-between': 'always',
        groups: [
          'type',
          ['builtin', 'external'],
          'custom-config',
          'custom-services',
          'custom-error',
          'custom-utils',
          'internal',
          ['parent', 'sibling', 'index'],
          ['parent-type', 'sibling-type', 'index-type'],
          'object',
          'unknown',
        ],
        'custom-groups': {
          value: {
            ['custom-config']: '@/config/**',
            ['custom-error']: '@/error/**',
            ['custom-services']: '@/services/**',
            ['custom-utils']: '@/utils/**',
          },
        },
      },
    ],
  },
};
