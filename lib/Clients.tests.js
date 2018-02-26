"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FS = require("fs-extra");
const Path = require("path");
const glob = require("globby");
const Clients = require("./Clients");
const cwd = process.cwd();
const sample_source = Path.join(cwd, "src", "samples", "clients");
const sample_target = Path.join(cwd, "build", "clients");
const config = { source: sample_source, target: sample_target };
const removeAllJSFiles = function () {
    const js_pattern = Path.join(sample_source, "**", "*.js");
    return glob(js_pattern).then(function (js_files) {
        return Promise.all(js_files.map(f => FS.remove(f)));
    });
};
const removeBuildDirectory = function () {
    return FS.remove(sample_target);
};
describe("scripts", function () {
    afterAll(function () {
        return removeAllJSFiles().then(removeBuildDirectory);
    });
    it("should pass on the list of modules", function () {
        return Clients.buildScripts(config).then(function (modules) {
            expect(modules).toEqual([{
                    name: "Main",
                    script: Path.join(sample_source, "scripts", "Main.ts"),
                    bundle: Path.join(sample_target, "scripts", "Main.js")
                }]);
        });
    });
    it("should compile module and all dependant scripts", function () {
        return Clients.buildScripts(config).then(function () {
            return glob("src/**/*.js").then(function (files) {
                const scripts_dir = Path.join("src", "samples", "clients", "scripts");
                expect(files).toEqual([
                    Path.join(scripts_dir, "/GreetingBuilder.js"),
                    Path.join(scripts_dir, "/Main.js"),
                    Path.join(scripts_dir, "/Simple.js")
                ]);
            });
        });
    });
    test("should produce a single bundle for each module in the build dir", function () {
        return Clients.buildScripts(config).then(function () {
            return glob("build/**/*.js").then(function (files) {
                expect(files).toEqual(["build/clients/scripts/Main.js"]);
            });
        });
    });
});
describe("styles", function () {
    afterAll(function () {
        return removeAllJSFiles().then(removeBuildDirectory);
    });
    it("should create a list of styles", function () {
        return Clients.buildStyles(config).then(function (modules) {
            expect(modules).toEqual([
                {
                    name: "General",
                    input: Path.join(sample_source, "styles", "General.css"),
                    output: Path.join(sample_target, "styles", "General.css")
                },
                {
                    name: "Main",
                    input: Path.join(sample_source, "styles", "Main.css"),
                    output: Path.join(sample_target, "styles", "Main.css")
                }
            ]);
        });
    });
});
