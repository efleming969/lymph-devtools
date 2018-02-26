"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const Templates = require("./Template");
describe("render", function () {
    test("function calls", function () {
        expect(Templates.render('@module("modules/home")', { dev: true }))
            .toEqual('<script type="module" src="modules/home"></script>');
    });
    test("building templates", function () {
        const cwd = process.cwd();
        const sample_source = Path.join(cwd, "src", "samples", "clients");
        const sample_target = Path.join(cwd, "build");
        return Templates.buildTemplates(sample_source, sample_target).then(function (output) {
            console.log(output);
        });
    });
});
