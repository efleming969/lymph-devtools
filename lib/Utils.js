"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const Glob = require("globby");
const FS = require("fs-extra");
exports.multiline = function (strings, ...args) {
    const whitespace = /^\s*|\n\s*$/g;
    const find_indent = /^[ \t\r]*\| (.*)$/gm;
    return strings.reduce(function (out, part, i) {
        if (args.hasOwnProperty(i)) {
            const lines = part.split('\n');
            // find indention of the current line
            const indent = lines[lines.length - 1].replace(/[ \t\r]*\| ([ \t\r]*).*$/, '$1');
            // indent interpolated lines to match
            const tail = (args[i] || '').split('\n').join('\n' + indent);
            return out + part + tail;
        }
        else {
            return out + part;
        }
    }, '').replace(whitespace, '').replace(find_indent, '$1');
};
exports.mapObject = function (fn, object) {
    return Object.keys(object).map(key => fn(key, object[key]));
};
exports.removeAllJSFiles = (dir) => function () {
    const js_pattern = Path.join(dir, "**", "*.js");
    return Glob(js_pattern).then(function (js_files) {
        return Promise.all(js_files.map(f => FS.remove(f)));
    });
};
exports.selectProps = (prop_names) => function (original_object) {
    return prop_names.reduce(function (obj, key) {
        return Object.assign({}, obj, original_object[key]);
    }, {});
};
//# sourceMappingURL=Utils.js.map