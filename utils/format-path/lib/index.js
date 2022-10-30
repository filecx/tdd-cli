'use strict';

const path = require('path');

function formatPath(p) {
    if (p && typeof p === 'string') {
        // sep分隔符
        const sep = path.sep;
        if (sep === '/') {
            return p;
        } else {
            return p.replace(/\\/g, '/');
        }
    }
    return p;
}

module.exports = formatPath;
