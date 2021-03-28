module.exports = {
  extends: '@vertexvis/vertexvis-typescript',
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      { vars: 'all', args: 'after-used' },
    ],
  },
  ignorePatterns: ['compiled'],
};
