'use strict';

const axios = require('axios');
const urlJoin = require('url-join');
const semver = require('semver');

function getNpmInfo(npmName, registry) {
    if (!npmName) {
        return null;
    }
    const registrysUrl = registry || getDefaultRegistry();
    const npmInfoUrl = urlJoin(registrysUrl, npmName);
    console.log(npmInfoUrl)
}

function getDefaultRegistry(isOriginal = false) {
    return isOriginal ? 'https://registry.npmjs.org': 'https://registry.npm.taobao.org';
}

module.exports = {
    getNpmInfo
}