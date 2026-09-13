import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import importX from 'eslint-plugin-import-x';
import unicorn from 'eslint-plugin-unicorn';
import sonarjs from 'eslint-plugin-sonarjs';
import { defineConfig, globalIgnores } from 'eslint/config';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';

export default defineConfig([
    globalIgnores(['node_modules', 'dist']),

    eslint.configs.recommended,
    tseslint.configs.recommended,

    {
        name: 'lang-extensions/base',
        files: ['**/*.{js,ts}'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                sourceType: 'module',
                project: './tsconfig.json',
            },
        },
        plugins: { prettier: prettierPlugin },
        rules: {
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
            'comma-dangle': ['error', 'always-multiline'],
            'no-process-exit': 'error',
            'object-shorthand': 'off',
            'no-magic-numbers': [
                'warn',
                {
                    ignore: [-1, 0, 1],
                    ignoreArrayIndexes: true,
                    detectObjects: true,
                },
            ],

            'prettier/prettier': 'error',
        },
    },

    {
        name: 'lang-extensions/importX',
        files: ['**/*.{js,ts}'],
        plugins: { 'import-x': importX },
        settings: {
            'import-x/resolver-next': [
                createTypeScriptImportResolver({
                    project: './tsconfig.json',
                }),
            ],
        },
        rules: {
            ...importX.configs.recommended.rules,

            'import-x/order': [
                'error',
                {
                    'newlines-between': 'never',
                    'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
                    'sortTypesGroup': true,
                },
            ],
        },
    },

    {
        name: 'lang-extensions/unicorn',
        files: ['**/*.{js,ts}'],
        plugins: { unicorn },
        rules: {
            ...unicorn.configs.recommended.rules,

            'unicorn/name-replacements': 'warn',

            'unicorn/no-array-callback-reference': 'off',
            'unicorn/no-null': 'off',
            'unicorn/no-thenable': 'off',
            'unicorn/no-undeclared-class-members': 'off',
            'unicorn/prefer-await': 'off',
            'unicorn/prefer-number-is-safe-integer': 'off',
            'unicorn/prefer-then-catch': 'off',
            'unicorn/catch-error-name': 'off',

            'unicorn/consistent-class-member-order': [
                'error',
                {
                    order: [
                        'static-field',
                        'static-block',
                        'static-method',
                        'private-field',
                        'public-field',
                        'constructor',
                        'public-method',
                        'private-method',
                    ],
                },
            ],
        },
    },

    {
        name: 'lang-extensions/sonarjs',
        files: ['**/*.{js,ts}'],
        plugins: { sonarjs },
        rules: {
            ...sonarjs.configs.recommended.rules,

            'sonarjs/function-return-type': 'off',
        },
    },

    {
        name: 'lang-extensions/prettier',
        ...prettierConfig,
    },
]);
