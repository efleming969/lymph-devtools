"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
