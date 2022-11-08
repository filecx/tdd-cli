'use strict';

const fs = require('fs');
const inquirer = require('inquirer');
const fse = require('fs-extra');
const semver = require('semver');
const Command = require('@tdd-cli-dev/command');
const log = require('@tdd-cli-dev/log');
const {eq} = require("semver");

const TYPE_PROJECT = 'project';
const TYPE_COMPONENT = 'component';

class InitCommand extends Command {
    init() {
        this.projectName = this._argv[0] || '';
        this.force = !!this._cmd.force;
        // log.verbose('projectName', this.projectName);
        // log.verbose('force', this.force);
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
            // 2.是否启动强制更新
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
        return await this.getProjectInfo()
    }

    async getProjectInfo() {
        const projectInfo = {};
        // 3.选择创建项目或组件
        const {type} = await inquirer.prompt({
            type: 'list',
            name: 'type',
            message: '请选择初始化类型',
            default: TYPE_PROJECT,
            choices: [{
                name: '项目',
                value: TYPE_PROJECT
            }, {
                name: '组件',
                value: TYPE_COMPONENT
            }]
        });
        log.verbose('type', type);
        // 4.获取项目的基本信息
        if (type === TYPE_PROJECT) {
            const o = await inquirer.prompt([{
                type: 'input',
                name: 'projectName',
                message: '请输入项目名称',
                default: '',
                validate: function (v) {
                    const done = this.async();
                    setTimeout(function (){
                        //1.输入的首字符必须为英文字符
                        //2.尾子符必须为英文或数字, 不能为字符
                        //3.字符仅允许"-_"
                        //\w=a-zA-Z0-9_
                        if (!/^[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(v)) {
                            done('请输入合法的项目名称');
                            return;
                        }
                        done(null, true);
                    },0)


                    // return /^[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(v);
                }
            }, {
                type: 'input',
                name: 'projectVersion',
                message: '请输入项目版本号',
                default: '1.0.0',
                validate:function (v) {
                    const done = this.async();
                    setTimeout(function (){
                        if (!(!!semver.valid(v))) {
                            done('请输入合法的版本号');
                            return;
                        }
                        done(null, true);
                    },0)
                },
                filter: function (v) {
                    if (semver.valid(v)) {
                        return semver.valid(v);
                    } else {
                        return v;
                    }

                }
            }]);
            console.log(o)
        } else if (type === TYPE_COMPONENT){

        }

        return projectInfo;
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
