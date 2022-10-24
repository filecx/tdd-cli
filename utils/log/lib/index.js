'use strict';

const log = require('npmlog');

log.level = process.env.LOG_LELV ? process.env.LOG_LELV : 'info'; // 判断debug模式
log.heading = 'tdd'; // 修改前缀
log.addLevel('success', 2000, { fg: 'green', bold: true }); // 添加自定义命令

module.exports = log;
