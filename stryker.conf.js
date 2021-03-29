/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
    _comment:
        "This config was generated using 'stryker init'. Please see the guide for more information: https://stryker-mutator.io/docs/stryker/guides/vuejs",
    testRunner: 'mocha',
    mutator: {
        plugins: [],
    },
    symlinkNodeModules: false,
    mochaOptions: {
        spec: ['test/index.js'],
    },
    buildCommand: 'rollup -c scripts/config.js',
};
