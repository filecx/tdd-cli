'use strict';

module.exports = core;

// require: .js/.json/.node
// .js -> module.exports/exports
// .json -> JSON.parse
// .node -> process.node
// any -> .js
const semver = require('semver');
const colors = require('colors/safe');
const userHome = require('user-home');
const pathExists = require('path-exists');
const log = require('@tdd-cli-dev/log');


const pkg = require('../package.json');
const constant = require('./const');

let args;

function core() {
   try {
       checkPkgVersion();
       checkNodeVersion();
       checkRoot();
       checkUserHome();
       checkInputArgs();
       log.verbose('debug', 'test debug log');
   } catch (e) {
       log.error(e.message)
   }
}

// 入参检查
function checkInputArgs() {
    const minimist = require('minimist');
    args = minimist(process.argv.slice(2));
    checkArgs();
}

// debug 模式启动
function checkArgs() {
    if (args.debug) {
        process.env.LOG_LEVEL = 'verbose';
    } else {
        process.env.LOG_LEVEL = 'info';
    }
    log.level = process.env.LOG_LEVEL;
}

// 获取用户的主目录
function checkUserHome() {
    if (!userHome || !pathExists(userHome)) {
        throw new Error(colors.red('当前登录用户主目录不存在!'))
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
