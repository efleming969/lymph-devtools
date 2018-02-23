"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Template_1 = require("./Template");
describe("render", function () {
    test("function calls", function () {
        expect(Template_1.render('@module("modules/home")', { dev: true }))
            .toEqual('<script type="module" src="modules/home"></script>');
    });
});
