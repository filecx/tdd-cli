'use strict';

module.exports = core;

// require: .js/.json/.node
// .js -> module.exports/exports
// .json -> JSON.parse
// .node -> process.node
// any -> .js
const pkg = require('../package.json');
const log = require('@tdd-cli-dev/log');

function core() {
    checkPkgVersion();
}

// 检查版本号
function checkPkgVersion() {
    log.info('cli', pkg.version)
}
