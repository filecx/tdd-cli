'use strict';

module.exports = core;

// require: .js/.json/.node
// .js -> module.exports/exports
// .json -> JSON.parse
// .node -> process.node
// any -> .js
const path = require('path');
const semver = require('semver');
const colors = require('colors/safe');
const userHome = require('user-home');
const pathExists = require('path-exists').sync;
const log = require('@tdd-cli-dev/log');


const pkg = require('../package.json');
const constant = require('./const');
const dotenv = require("dotenv");

let args,config;

function core() {
   try {
       checkPkgVersion();
       checkNodeVersion();
       checkRoot();
       checkUserHome();
       checkInputArgs();
       checkEnv();
       checkGlobalUpdate();
   } catch (e) {
       log.error(e.message)
   }
}

// 检查是否需要全局更新
function checkGlobalUpdate() {
    // 获取当前版本号和模块名
    const currentVersion = pkg.version;
    const npmName = pkg.name;
    // 调用npm API, 获取所有版本号
    const { getNpmInfo } = require('@tdd-cli-dev/get-npm-info');
    getNpmInfo(npmName);
    // 提取所有版本号, 对比那些版本号是大于当前版本号

    // 获取最新的版本号, 提示用户更新到最新版本

}

// 检查环境变量
function checkEnv() {
    const dotenv = require('dotenv');
    const dotenvPath = path.resolve(userHome, '.env');
    if (pathExists(dotenvPath)) {
        dotenv.config({
            path: dotenvPath,
        });
    }
    createDefaultConfig();
    log.verbose('环境变量', process.env.CLI_HOME_PATH);
}

function createDefaultConfig() {
    const cliConfig = {
        home: userHome
    };
    if (process.env.CLI_HOME) {
        cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME);
    } else {
        cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME);
    }
    process.env.CLI_HOME_PATH = cliConfig.cliHome;
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
