# Testing Information

## Testing Framework

API tests are run using the Jest assertion library. The _describe, test, and expect_ statements, among others, originate from there.

`describe` blocks are used to separate test files into manageable chunks. These blocks may also contain blocks such as `beforeAll` and `afterAll` to help with setup and teardown.

`test` blocks contain the actual tests. A `test` block is required within a test file. Each of these blocks will resolve to true or false depending on the provided `expect` statements.

`expect` is the actual assertion being made. At least one of these must exist in every `test` block, although there is no limit to how many can be used.

e.g. `expect(result).toBe(2);`
If `result` has a value of 2, the test will pass. Otherwise it fails.

More information on using Jest can be found [on their documentation page](https://jestjs.io/docs/api).

To assist with sending requests to the API directly, the library [SuperTest](https://www.npmjs.com/package/supertest) was used. SuperTest allows for easy writing of axios requests.

More information can be found under the [Architectural Decision Log](https://github.com/bcgov/CITZ-HybridWorkplace/wiki/Architectural-Decision-Log) in the Wiki.

## Running Tests

Tests currently run from the `app/server` folder.
In your terminal of choice, run `npm test` to start the react-scripts tests.
This will run all API tests.

To run only a specific file, use the command `npm test [filename]`. A part of a filename will suffice.

e.g. `npm test edit` would run files called _editPost.test.js_ and _editProfile.test.js_.

To run only a specific test case, use the command `npm run test:regex [testName]` to search for tests that contain that "testName" in the test description.

e.g. `npm run test:regex delete` would run any test with the word _delete_ in its description.

## Adding New Tests

New tests are to be included in the `app/server/tests` folder under an appropriate subfolder for the purpose of the test.

All files that are to be included in testing require a .test.js file extension. Otherwise they will not be detected by the test runner.

Test files should be named appropriately based on the aspect of the application they are testing. (e.g. header.test.js for Header-related testing)

## .env file

Tests require a .env file in the /server folder.
Without these keys, API tests will not run.
This file contains the the following

| Key     | Description                         | Example            |
| ------- | ----------------------------------- | ------------------ |
| API_REF | Target API URL that precedes routes | localhost:8080/api |
