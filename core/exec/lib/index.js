'use strict';

const Package = require('@tdd-cli-dev/package');
const log = require('@tdd-cli-dev/log');
const path = require("path");

const SETTINGS = {
    init: '@tdd-cli-dev/init'
};

const CACHE_DIR = 'dependencies';

function exec() {
    // 1. targetPath -> modulePath
    // 2. modulePath -> Package(npm模块)
    // 3. Package.getRootFile(获取入口文件)
    let targetPath = process.env.CLI_TARGET_PATH;
    const homePath = process.env.CLI_HOME_PATH;
    let storeDir = '';
    let pkg;
    log.verbose('targetPath', targetPath);
    log.verbose('homePath', homePath);

    const cmdObj = arguments[arguments.length-1];
    const cmdName = cmdObj.name();
    const packageName = SETTINGS[cmdName];
    const packageVersion = 'latest';

    if (!targetPath) {
        targetPath = path.resolve(homePath, CACHE_DIR); // 生成缓存路径
        storeDir = path.resolve(targetPath, 'node_modules');
        log.verbose('targetPath', targetPath);
        log.verbose('storeDir', storeDir);
        pkg = new Package({
            targetPath,
            storeDir,
            packageName,
            packageVersion
        });
        if (pkg.exists()) {
            // 更新package
        } else {
            // 安装package
            pkg.install()
        }
    } else {
         pkg = new Package({
            targetPath,
            packageName,
            packageVersion
        });
    }
    const rootFile = pkg.getRootFilePath();
    if (rootFile) {
        require(rootFile).apply(null,arguments);
    }

}

module.exports = exec;