const config = {
  verbose: true,
  testEnvironment: 'node',
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  collectCoverageFrom: [
    '**/*.js',
    '!node_modules/*',
    '!utils/resources/*',
    '!jest/reporters/*',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/src/app.js',
    '<rootDir>/src/service-app.js',
    '<rootDir>/src/public-app.js',
    '<rootDir>/coverage/',
    '<rootDir>/node_modules/',
    '<rootDir>/.eslintrc.js',
    '<rootDir>/jest.config.js',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/src/utils/jest/__mocks__/setEnv.js',
    '<rootDir>/src/utils/jest/__mocks__/state.js',
    '<rootDir>/src/utils/jest/__mocks__/common.js',
    '<rootDir>/src/utils/jest/__mocks__/sf-rest-request.js',
    '<rootDir>/src/utils/jest/__mocks__/cxengage-requests.js',
  ],
};

module.exports = config;
