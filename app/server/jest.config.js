module.exports = {
    verbose: true,
    testMatch: [
        "**/tests/*.test.js"
    ],
    collectCoverage: false,
    coverageDirectory: "./tests/coverage",
    rootDir: "./",
    testTimeout: 10000,
    setupFiles: [
        "dotenv/config"
    ]

};
