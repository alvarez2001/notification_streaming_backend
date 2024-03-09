module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin', '@stylistic/ts'],
    extends: [
        'plugin:@typescript-eslint/recommended',
        'eslint:recommended',
        'plugin:prettier/recommended',
    ],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/explicit-module-boundary-types': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        eqeqeq: 'error',
        curly: 'error',
        'no-eval': 'error',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        'no-const-assign': 'error',
        indent: 'off',
        '@typescript-eslint/indent': 'off',
        '@stylistic/ts/indent': [
            'error',
            4,
            {
                ignoredNodes: [
                    'Decorator',
                    'TSDecorator',
                    'ClassDeclaration[decorators.length > 0] > .key',
                    'ClassDeclaration[decorators.length > 0] .decorator',
                ],
            },
        ],
        'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
        quotes: ['error', 'single', { allowTemplateLiterals: true }],
    },
};
