module.exports = {
    verbose: true,
    testMatch: [
        "**/*.test.js"
    ],
    collectCoverage: false,
    coverageDirectory: "./tests/coverage",
    rootDir: "./",
    setupFiles: [
        "dotenv/config"
    ]
};
