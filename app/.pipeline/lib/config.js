'use strict';
const options = require('@bcgov/pipeline-cli').Util.parseArguments()
const changeId = options.pr //aka pull-request
const version = '1.0.0'
const name = 'hwp'

Object.assign(options.git, {owner: 'bcgov', repository: 'CITZ-HybridWorkplace'})
const phases = {
  build: {
    namespace: 'd63404-tools',
    name: `${name}`,
    phase: 'build',
    changeId: changeId,
    suffix: `-build-${changeId}`,
    instance: `${name}-build-${changeId}`,
    version: `${version}-${changeId}`,
    tag: `build-${version}-${changeId}`
  },
  dev: {
    namespace: 'd63404-dev',
    name: `${name}`,
    phase: 'dev',
    changeId: changeId,
    suffix: `-dev-${changeId}`,
    instance: `${name}-dev-${changeId}`,
    version: `${version}-${changeId}`,
    tag: `dev-${version}-${changeId}`
  },
  test: {
    namespace: 'd63404-test',
    name: `${name}`,
    phase: 'test',
    changeId: changeId,
    suffix: `-test`,
    instance: `${name}-test`,
    version: `${version}`,
    tag: `test-${version}`
  },
  prod: {
    namespace: 'd63404-prod',
    name: `${name}`,
    phase: 'prod',
    changeId: changeId,
    suffix: '',
    instance: `${name}-prod`,
    version: `${version}`,
    tag: `prod-${version}`
  },
};

// This callback forces the node process to exit as failure.
process.on('unhandledRejection', (reason) => {
  console.log(reason);
  process.exit(1);
});

module.exports = exports = {phases, options};
