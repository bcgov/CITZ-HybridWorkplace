# Testing Information

## Testing Framework

Originally, the [react-scripts](https://reactjs.org/docs/testing.html) library provided the basis for all testing scripts. Due to the strongly-coupled nature of components and the use of a browser-maintained state, it became less effective as a method for unit testing, as individual components would lack any state properties. Some unit tests still remain under `app/client/src/tests/unit`, but they are mostly proof-of-concept tests.

Because the react-scripts library uses [Jest](https://jestjs.io/docs/api) as its assertion library and was already used with this project's API testing, it allowed for the use of an additional tool for end-to-end (E2E) testing: **Puppeteer**.

[Puppeteer](https://github.com/puppeteer/puppeteer) is a Node library which allows for automated control of a browser. This can be used to navigate through websites using a set of user-commands.

Combined with Jest, tests can be constructed to perform actions with the same inputs expected from a user, then check if the expected result occurred.

Tests made with Puppeteer can be found under `app/client/src/tests/system`, with helper functions under `app/client/src/tests/functions`.

More information can be found under the [Architectural Decision Log](https://github.com/bcgov/CITZ-HybridWorkplace/wiki/Architectural-Decision-Log) in the Wiki.

## Running Tests

Tests currently run from the `app/client` folder.
In your terminal of choice, run `npm test` to start the react-scripts tests.

To run only a specific file, use the command `npm test [filename]`.
A part of a filename will suffice.

e.g. `npm test edit` would run files called _editPost.test.js_ and _editProfile.test.js_.

While the test watcher is running, tests will re-run if any change to code is detected. Only applicable tests should run.

## Adding New Tests

New tests are to be included in the `app/client/src/tests` folder.

All files that are to be included in testing require a .test.js file extension. Otherwise they will not be detected by the test runner.

Test files should be named appropriately based on the aspect of the application they are testing. (e.g. header.test.js for Header-related testing)

System (end-to-end) and Unit tests should be filed in the appropriate folders.

## .env file

Tests require a .env file in the /client folder.

Without these keys, system tests will not run.

This file contains the the following

| Key      | Description                                               |
| -------- | --------------------------------------------------------- |
| URL      | Target URL                                                |
| IDIR     | IDIR username                                             |
| PASSWORD | Password for above user                                   |
| HEADLESS | Whether test browser should run headless (true or false)  |
| SLOWMO   | Millisecond value for pause between each simulated action |
