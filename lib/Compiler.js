"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Typescript = require("typescript");
exports.compileScript = config => function (module_file) {
    const compile_options = {
        noEmitOnError: true,
        noImplicitAny: false,
        target: Typescript.ScriptTarget.ES2015,
        module: Typescript.ModuleKind.ES2015,
        moduleResolution: Typescript.ModuleResolutionKind.NodeJs,
        inlineSourceMap: true,
        inlineSources: true,
    };
    let program = Typescript.createProgram([module_file], compile_options);
    let emitResult = program.emit();
    let allDiagnostics = Typescript.getPreEmitDiagnostics(program)
        .concat(emitResult.diagnostics);
    allDiagnostics.forEach(diagnostic => {
        if (diagnostic.file) {
            let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            let message = Typescript.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
            console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        }
        else {
            console.log(`${Typescript.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`);
        }
    });
};
