module.exports = {
  settings: {
    'import/core-modules': [
      'electron',
    ],
  },
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    jquery: true,
  },
  extends: ['airbnb-base',
    'eslint:recommended',
    'plugin:node/recommended'],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'linebreak-style': 0,
    'no-console': 'off',
    'node/no-unpublished-require': ['error', {
      allowModules: ['electron'],
    }],
  },
};
