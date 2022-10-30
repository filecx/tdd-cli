'use strict';

const Package = require('@tdd-cli-dev/package');

function exec() {
    const pkg = new Package();
    console.log(pkg);
    console.log('exec');
    console.log(process.env.CLI_TARGET_PATH)
    // 1. targetPath -> modulePath
    // 2. modulePath -> Package(npm模块)
    // 3. Package.getRootFile(获取入口文件)
}

module.exports = exec;