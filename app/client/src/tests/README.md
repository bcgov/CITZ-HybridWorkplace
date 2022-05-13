# Testing Information

## Testing Framework

Currently, the react-scripts library provides the basis for all testing scripts. This package is supplemented with elements of the React Testing Library and other minor libraries as needed.

More information can be found under the [Architectural Decision Log](https://github.com/bcgov/CITZ-HybridWorkplace/wiki/Architectural-Decision-Log) in the Wiki.

## Running Tests

Tests currently run from the ```app/client/src``` folder. In your terminal of choice, run ```npm test``` to start the react-scripts tests.
While the test watcher is running, tests will re-run if any change to code is detected. Only applicable tests should run.

## Adding New Tests

New tests are to be included in the ```app/client/src/tests``` folder. 
All files that are to be included in testing require a .test.js file extension. Otherwise they will not be detected by the test runner.
Test files should be named appropriately based on the aspect of the application they are testing. (e.g. header.test.js for Header-related testing)

## Current Status

### 2022-05-13
Some minor front-end tests have been added so far. 
Issues with further testing include difficulty in targeting elements with no identifying attributes nor visible text.
Environment variables currently not working with testing setup. Manual changes needed.