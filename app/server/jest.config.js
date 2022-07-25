module.exports = {
  verbose: true,
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverage: false,
  coverageDirectory: "./tests/coverage",
  rootDir: "./",
  testTimeout: 2000,
  setupFiles: ["dotenv/config"],
};
