"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FS = require("fs-extra");
const Path = require("path");
const AWS = require("aws-sdk");
const Glob = require("globby");
const Mime = require("mime");
const Scripts = require("./Scripts");
const Styles = require("./Styles");
const Templates = require("./Template");
const cwd = process.cwd();
exports.config = function (source, target) {
    return Promise.resolve({ source, target });
};
exports.buildTemplates = function (config) {
    return Templates.buildTemplates(config.source, config.target)
        .then(() => config);
};
exports.buildScripts = function (config) {
    return Scripts.detectModules(config.source, config.target)
        .then(Scripts.compile)
        .then(Scripts.bundle)
        .then(() => config);
};
exports.buildStyles = function (config) {
    return Styles.detectStyles(config.source, config.target)
        .then(Styles.compile)
        .then(() => config);
};
exports.buildImages = function (config) {
    console.log("copying images", config);
    return FS.copy(Path.join(config.source, "images"), Path.join(config.target, "images")).then(() => config);
};
exports.deploy = function (config) {
    console.log("deploying clients");
    const s3 = new AWS.S3({ region: "us-east-1" });
    const namespace = "braintrustops";
    return Glob(config.target).then(function (files) {
        return Promise.all(files.map(function (file) {
            return FS.readFile(file).then(function (buffer) {
                const put_config = {
                    Body: buffer,
                    Bucket: namespace,
                    Key: file.replace("build/", ""),
                    ContentType: Mime.getType(file)
                };
                return s3.putObject(put_config).promise();
            });
        }));
    });
};
