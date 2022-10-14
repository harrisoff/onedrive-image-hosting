module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint-config-airbnb',
    'eslint-config-airbnb-typescript',
    'eslint-config-airbnb/hooks',
    'eslint-config-prettier',
  ],
  parserOptions: {
    // tsconfigRootDir: process.cwd(),
    project: './tsconfig.json',
  },
  rules: {
    'consistent-return': 'warn',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'no-console': 'warn',
    'no-nested-ternary': 'off',
    'no-underscore-dangle': 'off',

    '@typescript-eslint/naming-convention': 'off',

    'react/function-component-definition': 'off',
    'react/jsx-props-no-spreading': 'warn',
    'react/no-unstable-nested-components': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/exhaustive-deps': 'warn',
  },
}