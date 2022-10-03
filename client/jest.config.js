/* global module */

module.exports = {
  collectCoverageFrom: ["src/**/*.{ts,tsx}"],
  moduleNameMapper: {
    "\\.css$": "<rootDir>/__mocks__/styleMock.js",
    "d3-color": "<rootDir>/node_modules/d3-color/dist/d3-color.js",
    "d3-interpolate":
      "<rootDir>/node_modules/d3-interpolate/dist/d3-interpolate.js",
  },
  preset: "ts-jest",
  testTimeout: 1e4,
};
