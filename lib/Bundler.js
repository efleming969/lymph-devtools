"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const FS = require("fs");
const rollup_1 = require("rollup");
exports.buildModule = config => function (module_file) {
    const module_info = Path.parse(module_file);
    const rollup_input_options = {
        input: module_file
    };
    const rollup_output_options = {
        file: Path.join(process.cwd(), config.buildDir, module_info.name + ".js"),
        format: "iife",
        name: module_info.name,
        globals: config.globals
    };
    return rollup_1.rollup(rollup_input_options).then(function (bundle) {
        return bundle.write(rollup_output_options);
    }).then(function () {
        console.log("done bundling");
    }).catch(function (err) {
        console.log("there was an error");
    });
};
exports.getModules = config => new Promise(function (res, rej) {
    FS.readdir(config.sourceDir, function (e, files) {
        if (e)
            rej(e);
        res(files.filter(f => f.endsWith(".ts")));
    });
});
