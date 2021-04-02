/* global module */

module.exports = {
  collectCoverageFrom: ["src/**/*.{ts,tsx}"],
  moduleNameMapper: {
    "\\.css$": "<rootDir>/__mocks__/styleMock.js",
  },
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 3e4,
};
