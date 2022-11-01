'use strict';

const path = require('path');
const fse = require('fs-extra');
const pkgDir = require('pkg-dir').sync;
const pathExists = require('path-exists').sync;
const npmInstall = require('npminstall');
const { isObject } = require('@tdd-cli-dev/utils');
const formatPath = require('@tdd-cli-dev/format-path');
const { getDefaultRegistry,getNpmLatestVersion } = require('@tdd-cli-dev/get-npm-info');

class Package {
    constructor(options) {
        if (!options) {
            throw new Error('Package类的options参数不能为空!');
        }
        if (!isObject(options)) {
            throw new Error('Package类的options参数必须为对象!');
        }
        // package的目标路径
        this.targetPath = options.targetPath;
        // package的缓存路径
        this.storeDir = options.storeDir;
        // package的name
        this.packageName = options.packageName;
        // package的version
        this.packageVersion = options.packageVersion;
        // package的缓存目录前缀
        this.cacheFilePathPrefix = this.packageName.replace('/','_')
    }

    async prepare() {
        if (this.storeDir && !pathExists(this.storeDir)) {
            fse.mkdirpSync(this.storeDir);
        }
        if (this.packageVersion === 'latest') {
            this.packageVersion = await getNpmLatestVersion(this.packageName);
        }
        console.log(this.packageVersion);
    }

    get cacheFilePath() {
        return path.resolve(this.storeDir, `_${this.cacheFilePathPrefix}@${this.packageVersion}@${this.packageName}`)
    }

    // 判断当前Package是否存在
    async exists() {
        if (this.storeDir) {
            await this.prepare();
            return pathExists(this.cacheFilePath);
        } else {
            return pathExists(this.targetPath);
        }
    }

    // 安装Package
    async install() {
        await this.prepare();
        return npmInstall({
            root: this.targetPath,
            storeDir: this.storeDir,
            registry: getDefaultRegistry(),
            pkgs: [
                { name: this.packageName, version: this.packageVersion}
            ]
        })
    }

    // 更新Package
    async update() {
        await this.prepare();
    }

    // 获取入口文件的路径
    getRootFilePath() {
        // 1.获取package.json所在目录 - pkg-dir
        const dir = pkgDir(this.targetPath);
        // 2.读取package.json - require()
        if (dir) {
            const pkgFile = require(path.resolve(dir, 'package.json'));
            // 3.main/lib - path
            if (pkgFile && pkgFile.main) {
                return formatPath(path.resolve(dir, pkgFile.main));
            }
        }
        return null;
        // 4.路径的兼容(macOS/windows)
    }
}

module.exports = Package;
