'use strict';

module.exports = exec;

function exec() {
    console.log('exec');
    console.log(process.env.CLI_TARGET_PATH)
}
