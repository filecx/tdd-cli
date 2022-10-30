'use strict';

const Package = require('@tdd-cli-dev/package');
const log = require('@tdd-cli-dev/log');

const SETTINGS = {
    init: '@tdd-cli-dev/init'
}

function exec() {
    // 1. targetPath -> modulePath
    // 2. modulePath -> Package(npm模块)
    // 3. Package.getRootFile(获取入口文件)
    let targetPath = process.env.CLI_TARGET_PATH;
    const homePath = process.env.CLI_HOME_PATH;
    log.verbose('targetPath', targetPath);
    log.verbose('homePath', homePath);

    const cmdObj = arguments[arguments.length-1];
    const cmdName = cmdObj.name();
    const packageName = SETTINGS[cmdName];
    const packageVersion = 'latest';

    if (!targetPath) {
        targetPath = ''; // 生成缓存路径
    }

    const pkg = new Package({
        targetPath,
        packageName,
        packageVersion
    });
    console.log(pkg.getRootFilePath());

}

module.exports = exec;