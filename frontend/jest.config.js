export default {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  moduleNameMapping: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/src/__mocks__/fileMock.js",
  },
  testMatch: [
    "**/tests/**/*.test.jsx",
    "**/tests/**/*.test.js",
    "**/__tests__/**/*.jsx",
    "**/__tests__/**/*.js",
    "**/?(*.)+(spec|test).jsx",
    "**/?(*.)+(spec|test).js",
  ],
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/main.jsx",
    "!src/index.css",
    "!src/**/*.test.{js,jsx}",
    "!src/__mocks__/**",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  testTimeout: 10000,
  verbose: true,
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
};
