"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FS = require("fs-extra");
const Path = require("path");
const Glob = require("globby");
const helpers = {
    module: function (ctx, module_uri) {
        const type = ctx.dev ? "module" : "application/javascript";
        const src = ctx.dev ? module_uri : module_uri + ".js";
        return `<script type="${type}" src="${src}"></script>`;
    }
};
exports.render = function (template_string, context) {
    return template_string.replace(/@([a-zA-Z\.]*)\((.*)\)/g, function (_, name, args) {
        try {
            const fn = `return helpers.${name}( ctx, ${args})`;
            return new Function("helpers", "ctx", fn).apply(null, [helpers, context]);
        }
        catch (e) {
            return '';
        }
    });
};
exports.buildTemplates = function (source, target) {
    const html_files_pattern = Path.join(source, "**", "*.html");
    return Glob(html_files_pattern).then(function (files) {
        return Promise.all(files.map(function (file) {
            const file_name = Path.basename(file);
            return FS.readFile(file, "utf8").then(function (template) {
                const rendered_template = exports.render(template, { dev: false });
                const target_file = Path.join(target, file_name);
                return FS.writeFile(target_file, rendered_template, "utf8");
            });
        }));
    });
};
