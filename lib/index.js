"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Express = require("express");
const Typescript = require("typescript");
const FS = require("fs");
const Path = require("path");
const Mustache = require("mustache");
exports.run = function (config) {
    const app = Express();
    const defaultRootTemplate = (modules) => `<!doctype html>
    <html>
        <head></head>
        <body>
            <h1>Lymph DevTools</h1>
            <ul>${modules.map(m => `<li> <a href="/modules/${m}/index.html">${m}</a></li>`).join("")}</ul>
        </body>
    </html>
    `;
    app.get("/", function (req, res) {
        FS.readdir(Path.join(process.cwd(), config.root, "modules"), function (err, modules) {
            res.send(defaultRootTemplate(modules || []));
        });
    });
    app.get("/modules/:module_name/index.html", function (req, res) {
        const module_name = req.params.module_name;
        const template_dir = Path.join(process.cwd(), config.root, "modules", module_name);
        const template_path = Path.join(template_dir, "index.html");
        FS.readFile(template_path, "utf8", function (err, template) {
            res.send(Mustache.render(template, config.modules[module_name] || {}));
        });
    });
    app.use(Express.static(config.root));
    const getESModuleIndex = function (module_name) {
        const module_dir = Path.join(process.cwd(), "node_modules", module_name);
        const module_package_path = Path.join(module_dir, "package.json");
        const raw_package_config = FS.readFileSync(module_package_path, "utf8");
        const package_config = JSON.parse(raw_package_config);
        if (package_config.module == null)
            throw "dependencies must support es modules";
        return Path.join("/", "node_modules", module_name, package_config.module.replace(".js", ""));
    };
    app.get("/node_modules/*", function (req, res) {
        res.sendFile(Path.join(process.cwd(), req.url + ".js"));
    });
    app.get(/\/(modules|components)\/*/, function (req, res) {
        const source_file = Path.join(process.cwd(), config.root, req.url.replace(".js", "") + ".ts");
        FS.readFile(source_file, "utf8", function (err, file) {
            const result = Typescript.transpileModule(file, {
                compilerOptions: {
                    module: Typescript.ModuleKind.ES2015,
                    inlineSources: true,
                    inlineSourceMap: true
                },
                fileName: source_file
            });
            res.header({ "content-type": "application/javascript" });
            res.send(result.outputText.replace(/from \"([a-zA-Z_\-\/]*)\"/g, function (match, p1) {
                if (p1[0] === "." || p1[0] === "/") {
                    return p1;
                }
                return `from "${getESModuleIndex(p1)}"`;
            }));
        });
    });
    app.listen(config.port, function () {
        console.log(`server running @ ${config.port}`);
    });
};
