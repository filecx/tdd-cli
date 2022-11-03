'use strict';

const Command = require('@tdd-cli-dev/command');
const log = require('@tdd-cli-dev/log');

class InitCommand extends Command {
    init() {
        this.projectName = this._argv[0] || '';
        this.force = !!this._cmd.force;
        log.verbose('projectName', this.projectName);
        log.verbose('force', this.force);
    }
    exec() {
        console.log('init实现逻辑');
    }
}

function init(argv) {
    new InitCommand(argv);
}

module.exports = init;
module.exports.InitCommand = InitCommand;
