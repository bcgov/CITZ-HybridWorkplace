module.exports = {
    root: true,
    env: {
        browser: true,
        es6: true,
        node: true,
        jest: true
    },
    "parserOptions": {
        "sourceType": "module"
    },
    extends: [
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
     ],
    plugins: ['react', 'jest'],
    rules: {
        //'no-console': 'error',
        "no-unused-vars": 0
    },
        "overrides": [
          {
            "files": [
              "**/*.test.js",
              "**/*.spec.jsx"
            ],
          }
        ]
    
}
