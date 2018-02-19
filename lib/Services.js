"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const aws_sdk_1 = require("aws-sdk");
const FS = require("fs");
const Path = require("path");
const Archiver = require("archiver");
const cwd = process.cwd();
const npm_bin = Path.join(cwd, "node_modules", ".bin");
exports.zipModule = (config) => function (module_file) {
    const module_name = module_file.replace(".ts", "");
    const archive = Archiver("zip");
    const artifact_file = `${config.namespace}--${module_name}.zip`;
    return new Promise(function (resolve, reject) {
        const output = FS.createWriteStream(Path.join(cwd, config.buildDir, artifact_file));
        archive.on("error", function (err) {
            reject(err);
        });
        output.on("close", function () {
            resolve(module_name);
        });
        archive.directory(Path.join(cwd, config.buildDir, module_name), module_name);
        archive.pipe(output);
        archive.finalize();
    });
};
exports.updateFunction = (config) => function (module_name) {
    const lambda = new aws_sdk_1.Lambda({ region: config.region });
    const function_name = `${config.namespace}--${module_name}`;
    return lambda.updateFunctionCode({
        FunctionName: function_name,
        S3Bucket: `${config.namespace}-artifacts`,
        S3Key: function_name
    }).promise();
};
exports.recursiveExecuteOnDir = function (fn, root) {
    FS.readdir(root, function (e, files) {
        files.forEach(function (file) {
            const path = Path.join(root, file);
            !FS.statSync(path).isDirectory() ?
                fn(path) : exports.recursiveExecuteOnDir(fn, path);
        });
    });
};
exports.compileModule = (config) => function (module_file) {
    const module_name = module_file.replace(".ts", "");
    const build_dir = Path.join(cwd, config.buildDir, module_name);
    const index_file = Path.join(cwd, config.sourceDir, module_file);
    const tsc_options = ["--outDir", build_dir, index_file];
    return new Promise(function (res, rej) {
        child_process_1.execFile(Path.join(npm_bin, "tsc"), tsc_options, function (err, stdout, stderr) {
            if (err)
                rej(err);
            res(module_file);
        });
    });
};
exports.getModules = function (config) {
    return new Promise(function (res, rej) {
        FS.readdir(config.sourceDir, function (e, files) {
            if (e)
                rej(e);
            res(files.filter(f => f.endsWith(".ts")));
        });
    });
};
