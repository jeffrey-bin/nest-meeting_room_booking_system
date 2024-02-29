module.exports = {
  extends: ['@nkzw'],
  rules: {
    'sort-keys-fix/sort-keys-fix': 'off',
    'no-console': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'typescript-sort-keys/interface': 'off',
    'no-restricted-syntax': [
      'error',
      {
        selector:
          "CallExpression[callee.object.name='console'][callee.property.name!=/^(log|warn|error|info|trace)$/]",
        message: 'Unexpected property on console object was called',
      },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: {}, // 这会使得ESLint使用tsconfig.json中的路径别名
    },
  },
};
