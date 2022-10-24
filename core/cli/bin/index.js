#!/usr/bin/env node

const importLocal = require('import-local');

// 检查是否是本地的模块
if (importLocal(__filename)) {
    require('npmlog').info('cli', '正在使用 tdd-cli 本地版本');
} else {
    require('../lib')(process.argv.slice(2))
}