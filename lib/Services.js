"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
const Typescript = require("typescript");
const Glob = require("globby");
const FS = require("fs-extra");
const Path = require("path");
const Archiver = require("archiver");
const Webpack = require("webpack");
exports.uploadFunction = (config) => function (services) {
    return Promise.all(services.map(function (service_file) {
        const module_name = Path.basename(service_file, ".ts");
        const s3 = new aws_sdk_1.S3({ region: config.region });
        const bundle_name = `${config.namespace}--${module_name}`;
        console.log(`uploading ${bundle_name} to ${config.namespace}`);
        return FS.readFile(`${config.buildDir}/${bundle_name}.zip`)
            .then(function (buffer) {
            return {
                Body: buffer,
                Bucket: `${config.namespace}-artifacts`,
                Key: `${bundle_name}.zip`
            };
        }).then(put_config => s3.putObject(put_config).promise())
            .then(() => service_file);
    }));
};
exports.updateFunction = (config) => function (services) {
    return Promise.all(services.map(function (service_file) {
        const module_name = Path.basename(service_file, ".ts");
        const lambda = new aws_sdk_1.Lambda({ region: config.region });
        const function_name = `${config.namespace}--${module_name}`;
        const update_config = {
            FunctionName: function_name,
            S3Bucket: `${config.namespace}-artifacts`,
            S3Key: `${function_name}.zip`
        };
        console.log(`updating ${function_name} from ${config.namespace}`);
        return lambda.updateFunctionCode(update_config)
            .promise()
            .then(() => service_file);
    }));
};
exports.publishFunction = (config) => function (services) {
    return Promise.all(services.map(function (service_file) {
        const module_name = Path.basename(service_file, ".ts");
        const lambda = new aws_sdk_1.Lambda({ region: config.region });
        const function_name = `${config.namespace}--${module_name}`;
        const update_config = {
            FunctionName: function_name
        };
        console.log(`publishing ${function_name} to ${config.namespace}`);
        return lambda.publishVersion(update_config).promise();
    }));
};
exports.detect = function (config) {
    return Glob(Path.join(config.sourceDir, "*.ts"));
};
exports.compile = (config) => function (services) {
    const compile_options = {
        noEmitOnError: true,
        noImplicitAny: false,
        target: Typescript.ScriptTarget.ES2015,
        module: Typescript.ModuleKind.CommonJS,
        moduleResolution: Typescript.ModuleResolutionKind.NodeJs,
        outDir: Path.join(config.buildDir, "pre")
    };
    const program = Typescript.createProgram(services, compile_options);
    return new Promise(function (resolve, reject) {
        console.log("compiling to", config.buildDir);
        services.forEach(s => console.log("\t" + s));
        const emitResult = program.emit();
        const allDiagnostics = Typescript.getPreEmitDiagnostics(program)
            .concat(emitResult.diagnostics);
        const results = allDiagnostics.map(function (diagnostic) {
            if (diagnostic.file) {
                let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                let message = Typescript.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
                return `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`;
            }
            else {
                return `${Typescript.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`;
            }
        });
        results.length > 0 ? reject(results) : resolve(services);
    });
};
exports.bundle = (config) => function (services) {
    return Promise.all(services.map(function (service_file) {
        const module_name = Path.basename(service_file, ".ts");
        const options = {
            entry: Path.join(process.cwd(), config.buildDir, "pre", `${module_name}.js`),
            mode: "production",
            output: {
                path: Path.join(process.cwd(), config.buildDir),
                libraryTarget: "commonjs",
                filename: `${module_name}.js`
            },
            target: "node",
            externals: ["aws-sdk"]
        };
        return new Promise(function (resolve, reject) {
            console.log(`bundling ${module_name} to  ${options.output.path}`);
            Webpack(options, function (err, stats) {
                if (err)
                    reject(err);
                if (stats.hasErrors()) {
                    reject(stats.toString());
                }
                resolve(service_file);
            });
        });
    }));
};
exports.archive = (config) => function (services) {
    return Promise.all(services.map(function (service_file) {
        const bundle_name = Path.basename(service_file, ".ts");
        const archive = Archiver("zip");
        const archive_file = `${config.namespace}--${bundle_name}.zip`;
        return new Promise(function (resolve, reject) {
            const output = FS.createWriteStream(Path.join(config.buildDir, archive_file));
            archive.on("error", function (err) {
                reject(err);
            });
            output.on("close", function () {
                resolve(service_file);
            });
            console.log(`archiving ${bundle_name} to ${archive_file}`);
            archive.file(Path.join(config.buildDir, `${bundle_name}.js`), { name: "index.js" });
            archive.pipe(output);
            archive.finalize();
        });
    }));
};
//# sourceMappingURL=Services.js.map