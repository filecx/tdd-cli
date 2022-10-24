'use strict';

module.exports = core;

// require: .js/.json/.node
// .js -> module.exports/exports
// .json -> JSON.parse
// .node -> process.node
// any -> .js
const semver = require('semver');
const colors = require('colors/safe')
const log = require('@tdd-cli-dev/log');
const pkg = require('../package.json');
const constant = require('./const');

function core() {
   try {
       checkPkgVersion();
       checkNodeVersion();
       checkRoot();
   } catch (e) {
       log.error(e.message)
   }
}

// 检查root账户
function checkRoot() {
    // console.log(`${process.geteuid()}`);
    const rootCheck = require('root-check');
    rootCheck();
}

// 最低支持版本号
function checkNodeVersion() {
    // 获取当前Node版本号
    const currentVersion = process.version;
    // 对比最低版本号
    const lowestVersion = constant.LOWEST_NODE_VERSION;
    if (!semver.gte(currentVersion,lowestVersion)) {
        throw new Error(colors.red(`tdd-cli 需要安装 v${lowestVersion} 以上版本的 Node.js`))
    }
}

// 检查版本号
function checkPkgVersion() {
    log.info('cli', pkg.version)
}
