module.exports = {
    verbose: true,
    testMatch: [
        "**/tests/*.test.js"
    ],
    collectCoverage: false,
    coverageDirectory: "./tests/coverage",
    rootDir: "./",
    setupFiles: [
        "dotenv/config"
    ]

};
