module.exports = {
  env: {
    browser: false,
    node: true,
    commonjs: true,
    es6: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  parserOptions: {
    ecmaVersion: 2022,
  },
  rules: {
    'no-empty-function': 'off',
    'no-useless-constructor': 'off',
    'no-restricted-syntax': 0,
    'no-await-in-loop': 0,
    /**
     * Allow functions and classes to be defined after use.
     * Compiler can handle this and it makes the code more readable.
     */
    'no-use-before-define': [2, 'nofunc'],
  },
};

