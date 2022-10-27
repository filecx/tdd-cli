'use strict';

const getNpmInfo = require('../lib/get-npm-info');
const assert = require('assert').strict;

assert.strictEqual(getNpmInfo(), 'Hello from getNpmInfo');
console.info("getNpmInfo tests passed");
