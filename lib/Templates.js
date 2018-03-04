"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FS = require("fs-extra");
const Path = require("path");
const Glob = require("globby");
const Utils_1 = require("./Utils");
const renderStyle = style => `<link rel="stylesheet" href="${style}">`;
const renderModule = is_dev => function (path) {
    const type = is_dev ? "module" : "application/javascript";
    const src = path + (is_dev ? "" : ".js");
    return `<script type="${type}" src="${src}"></script>`;
};
const renderScript = is_dev => function (script) {
    const path = is_dev ? script.local : script.remote;
    return `<script type="application/javascript" src="${path}"></script>`;
};
exports.render = function (template) {
    const { name, config, dev } = template;
    const text = Utils_1.multiline `
        | <!DOCTYPE html>

        | <html lang="en">

        | <head>
        |     <meta charset="UTF-8">
        |     <meta http-equiv="x-ua-compatible" content="ie=edge">
        |     <meta name="viewport" content="width=device-width, initial-scale=1">
        |     <title>${config.title}</title>

        |     ${config.styles.map(renderStyle).join("")}

        |     ${config.scripts.map(renderScript(dev)).join("")}
        |     ${config.modules.map(renderModule(dev)).join("")}
        | </head>

        | <body></body>

        | </html>
    `;
    return { name, dev, config, text };
};
exports.read = function (config_file_path) {
    const name = Path.basename(config_file_path, ".json");
    return FS.readFile(config_file_path, "utf8")
        .then(config_string => JSON.parse(config_string))
        .then(config => ({ name, config, text: "" }));
};
exports.detect = function (source_dir) {
    const config_file_pattern = Path.join(source_dir, "*.json");
    const parseToTemplateConfig = config_string => JSON.parse(config_string);
    return Glob(config_file_pattern).then(function (config_file_paths) {
        return config_file_paths.map(function (config_file_path) {
            const name = Path.basename(config_file_path, ".json");
            return FS.readFile(config_file_path, "utf8")
                .then(parseToTemplateConfig)
                .then(config => ({ name, config, text: "" }));
        });
    }).then(parse_config_promises => Promise.all(parse_config_promises));
};
exports.write = (target) => function (template) {
    const file_name = Path.join(target, template.name + ".html");
    return FS.ensureDir(target)
        .then(() => FS.writeFile(file_name, template.text, "utf8"));
};
//# sourceMappingURL=Templates.js.map