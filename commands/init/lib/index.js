'use strict';

const fs = require('fs');
const inquirer = require('inquirer');
const fse = require('fs-extra');
const Command = require('@tdd-cli-dev/command');
const log = require('@tdd-cli-dev/log');

class InitCommand extends Command {
    init() {
        this.projectName = this._argv[0] || '';
        this.force = !!this._cmd.force;
        log.verbose('projectName', this.projectName);
        log.verbose('force', this.force);
    }
    async exec() {
      try {
          // 1.准备阶段
          await this.prepare();
          // 2.下载阶段
          // 3.安装阶段
      } catch (e) {
          log.error(e.message);
      }
    }

    async prepare() {
        // 1.判断当前目录是否为空
        const localPath = process.cwd();
        if (!this.isDirEmpty(localPath)) {
            let ifContinue = false;
            if (!this.force) {
                // 是否继续创建
                ifContinue = (await inquirer.prompt({
                    type: 'confirm',
                    name: 'ifContinue',
                    default: false,
                    message: '当前文件夹不为空, 是否继续创建项目?'
                })).ifContinue;
                if (!ifContinue) {
                    return;
                }
            }
            if (ifContinue || this.force) {
                // 给用户二次确认
                const  {confirmDelete} = await inquirer.prompt({
                    type: 'confirm',
                    name: 'confirmDelete',
                    default: false,
                    message: '是否确认清空当前目录下的文件?'
                })
                if (confirmDelete) {
                    fse.emptyDirSync(localPath);
                }
                // 清空当前目录
            }
        }
        // const localPath = process.cwd();
        // console.log(localPath);
        // 2.是否启动强制更新
        // 3.选择创建项目或组件
        // 4.获取项目的基本信息
    }

    isDirEmpty(localPath) {
        let fileList = fs.readdirSync(localPath);
        // 文件过滤的逻辑
        fileList = fileList.filter(file => (
            !file.startsWith('.') && ['node_modules'].indexOf(file) < 0
        ));
        return !fileList || fileList.length <= 0;
    }
}

function init(argv) {
    new InitCommand(argv);
}

module.exports = init;
module.exports.InitCommand = InitCommand;
