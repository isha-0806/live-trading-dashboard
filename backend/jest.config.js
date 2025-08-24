export default {
  testEnvironment: "node",
  moduleNameMapping: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testMatch: [
    "**/tests/**/*.test.js",
    "**/__tests__/**/*.js",
    "**/?(*.)+(spec|test).js",
  ],
  collectCoverageFrom: [
    "**/*.js",
    "!**/node_modules/**",
    "!**/tests/**",
    "!**/coverage/**",
    "!jest.config.js",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  setupFilesAfterEnv: [],
  testTimeout: 10000,
  verbose: true,
};
