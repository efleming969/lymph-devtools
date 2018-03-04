"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FS = require("fs-extra");
const Path = require("path");
const AWS = require("aws-sdk");
const Glob = require("globby");
const Mime = require("mime");
const Scripts = require("./Scripts");
const Styles = require("./Styles");
const Templates = require("./Templates");
exports.configure = function (source, target) {
    return Promise.resolve({ source, target });
};
const mapToPromises = fn => list => Promise.all(list.map(fn));
const logit = it => console.log(it);
exports.buildTemplates = function (config) {
    return Templates.detect(config.source)
        .then(templates => templates.map(Templates.render))
        .then(templates => templates.map(Templates.write(config.target)))
        .then(() => config);
};
exports.buildScripts = function (config) {
    return Scripts.detect(config.source, config.target)
        .then(Scripts.compile)
        .then(Scripts.bundle)
        .then(() => config);
};
exports.buildStyles = function (config) {
    return Styles.detect(config.source, config.target)
        .then(Styles.compile)
        .then(() => config);
};
exports.buildStatics = function (config) {
    const source_dir = Path.join(config.source, "statics");
    const target_dir = Path.join(config.target, "statics");
    return FS.copy(source_dir, target_dir)
        .then(() => config);
};
exports.deploy = function (source, target, region) {
    const s3 = new AWS.S3({ region });
    return Glob(source).then(function (files) {
        return Promise.all(files.map(function (file) {
            return FS.readFile(file).then(function (buffer) {
                const put_config = {
                    Body: buffer,
                    Bucket: target,
                    Key: file.replace(source + "/", ""),
                    ContentType: Mime.getType(file) // content-type is needed since S3 is bad at guessing mime types
                };
                return s3.putObject(put_config).promise();
            });
        }));
    });
};
//# sourceMappingURL=Clients.js.map