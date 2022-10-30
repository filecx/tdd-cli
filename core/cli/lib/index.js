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
const commander = require('commander');
const log = require('@tdd-cli-dev/log');
const init = require('@tdd-cli-dev/init');
const exec = require('@tdd-cli-dev/exec');


const pkg = require('../package.json');
const constant = require('./const');

const program = new commander.Command();

async function core() {
   try {
       await prepare();
       registerCommand();
   } catch (e) {
       log.error(e.message)
   }
}

// 命令注册
function registerCommand() {
    program
        .name(Object.keys(pkg.bin)[0])
        .usage('<command> [options]')
        .version(pkg.version)
        .option('-d, --debug', '是否开启调试模式', false)
        .option('-tp, --targetPath <targetPath>', '是否指定本地调试文件路径', '');

    program
        .command('init [projectName]')
        .option('-f, --force', '是否强制初始化项目')
        .action(exec);

    // 开启debug模式
    program.on('option:debug',  () => {
        if (program.debug) {
            process.env.LOG_LEVEL = 'verbose';
        } else {
            process.env.LOG_LEVEL = 'info';
        }
        log.level = process.env.LOG_LEVEL;
    });

    // 指定targetPath
    program.on('option:targetPath', () => {
        process.env.CLI_TARGET_PATH = program.targetPath;
    });

    // 对未知命令监听
    program.on('command:*',(obj) => {
       const availableCommands = program.commands.map(cmd => cmd.name());
        console.log(colors.red('未知的命令: ' + obj[0]))
        if (availableCommands.length > 0) {
            console.log(colors.red('可用的命令: ' + availableCommands.join(',')))
        }

    });

    program.parse(process.argv);

    if (process.argv.length < 1) {
        program.outputHelp();
        console.log()
    }
}

async function prepare() {
    checkPkgVersion();
    checkNodeVersion();
    checkRoot();
    checkUserHome();
    checkEnv();
    await checkGlobalUpdate();
}

// 检查是否需要全局更新
async function checkGlobalUpdate() {
    const pkgName = require('../../../package.json');
    const currentVersion = pkgName.version;
    const npmName = pkgName.name;
    const { getNpmSemverVersion } = require('@tdd-cli-dev/get-npm-info');
    const lastVersions = await getNpmSemverVersion(currentVersion,npmName);
    if (lastVersions && semver.gt(lastVersions, currentVersion)) {
        log.warn('更新提示',colors.yellow(`请手动更新 ${npmName}, 当前版本: ${currentVersion}, 最新版本: ${lastVersions}, 更新命令: npm install -g ${npmName}`))
    }

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
    // log.verbose('环境变量', process.env.CLI_HOME_PATH);
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
