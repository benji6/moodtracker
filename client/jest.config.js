/* global module */

module.exports = {
  collectCoverageFrom: ["src/**/*.{ts,tsx}"],
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 3e4,
};
