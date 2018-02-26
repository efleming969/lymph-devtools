"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FS = require("fs-extra");
const Path = require("path");
const Glob = require("globby");
const PostCSS = require("postcss");
const process = function (style) {
    const post_css_config = { from: style.input, to: style.output };
    const target_dir = Path.dirname(style.output);
    console.log(target_dir);
    return FS.ensureDir(target_dir)
        .then(() => FS.readFile(style.input, "utf8"))
        .then(css => PostCSS([]).process(css, post_css_config))
        .then(result => FS.writeFile(style.output, result.css));
};
exports.compile = function (styles) {
    return Promise.all(styles.map(process)).then(() => styles);
};
exports.detectStyles = function (source, target) {
    const css_file_pattern = Path.join(source, "**", "*.css");
    return Glob(css_file_pattern).then(files => files.map(function (f) {
        const name = Path.basename(f, ".css");
        const input = f;
        const output = Path.join(target, "styles", name + ".css");
        return { name, input, output };
    }));
};
