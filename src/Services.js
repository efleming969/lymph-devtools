"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const aws_sdk_1 = require("aws-sdk");
const FS = require("fs");
const Path = require("path");
const Archiver = require("archiver");
const cwd = process.cwd();
const npm_bin = Path.join(cwd, "node_modules", ".bin");
exports.zipModule = config => function (module_file) {
    const module_name = module_file.replace(".ts", "");
    const archive = Archiver("zip");
    const artifact_file = `${config.namespace}--${module_name}.zip`;
    return new Promise(function (resolve, reject) {
        const output = FS.createWriteStream(Path.join(cwd, config.buildDir, artifact_file));
        archive.on("error", function (err) {
            reject(err);
        });
        output.on("close", function () {
            resolve(module_name);
        });
        archive.directory(Path.join(cwd, config.buildDir, module_name), "");
        archive.pipe(output);
        archive.finalize();
    });
};
exports.uploadFunction = config => function (module_file) {
    const module_name = module_file.replace(".ts", "");
    const s3 = new aws_sdk_1.S3({ region: config.region });
    const function_name = `${config.namespace}--${module_name}`;
    return new Promise(function (res, rej) {
        FS.readFile(`${config.buildDir}/${function_name}.zip`, function (e, buffer) {
            const put_config = {
                Body: buffer,
                Bucket: `${config.namespace}-artifacts`,
                Key: `${function_name}.zip`
            };
            return s3.putObject(put_config, function (e, data) {
                if (e)
                    rej(e);
                res(module_file);
            });
        });
    });
};
exports.updateFunction = config => function (module_file) {
    const module_name = module_file.replace(".ts", "");
    const lambda = new aws_sdk_1.Lambda({ region: config.region });
    const function_name = `${config.namespace}--${module_name}`;
    return new Promise(function (res, rej) {
        const update_config = {
            FunctionName: function_name,
            S3Bucket: `${config.namespace}-artifacts`,
            S3Key: `${function_name}.zip`
        };
        lambda.updateFunctionCode(update_config, function (e, data) {
            if (e)
                rej(e);
            res(data);
        });
    });
};
exports.compileModule = config => function (module_file) {
    const module_name = module_file.replace(".ts", "");
    const build_dir = Path.join(cwd, config.buildDir, module_name);
    const index_file = Path.join(cwd, config.sourceDir, module_file);
    const tsc_options = ["--outDir", build_dir, index_file];
    return new Promise(function (res, rej) {
        child_process_1.execFile(Path.join(npm_bin, "tsc"), tsc_options, function (err, stdout, stderr) {
            if (err)
                rej(err);
            res(module_file);
        });
    });
};
exports.getModules = config => new Promise(function (res, rej) {
    FS.readdir(config.sourceDir, function (e, files) {
        if (e)
            rej(e);
        res(files.filter(f => f.endsWith(".ts")));
    });
});
const promiseAll = fn => list => Promise.all(list.map(fn));
exports.build = function (config) {
    return exports.getModules(config)
        .then(promiseAll(exports.compileModule(config)))
        .then(promiseAll(exports.zipModule(config)))
        .then(promiseAll(exports.uploadFunction(config)))
        .then(promiseAll(exports.updateFunction(config)))
        .then(output => console.dir(output))
        .catch(e => console.log(e));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmljZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJTZXJ2aWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlEQUF3QztBQUN4QyxxQ0FBb0M7QUFFcEMsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFFLElBQUksQ0FBRSxDQUFBO0FBQzFCLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBRSxNQUFNLENBQUUsQ0FBQTtBQUM5QixNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUUsVUFBVSxDQUFFLENBQUE7QUFFdEMsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFBO0FBQ3pCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUUsR0FBRyxFQUFFLGNBQWMsRUFBRSxNQUFNLENBQUUsQ0FBQTtBQUUzQyxRQUFBLFNBQVMsR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDLFVBQVcsV0FBVztJQUNyRCxNQUFNLFdBQVcsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFFLEtBQUssRUFBRSxFQUFFLENBQUUsQ0FBQTtJQUNwRCxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUUsS0FBSyxDQUFFLENBQUE7SUFDakMsTUFBTSxhQUFhLEdBQUcsR0FBSSxNQUFNLENBQUMsU0FBVSxLQUFNLFdBQVksTUFBTSxDQUFBO0lBRW5FLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBRSxVQUFXLE9BQU8sRUFBRSxNQUFNO1FBQzFDLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsQ0FDL0IsSUFBSSxDQUFDLElBQUksQ0FBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxhQUFhLENBQUUsQ0FBRSxDQUFBO1FBRXRELE9BQU8sQ0FBQyxFQUFFLENBQUUsT0FBTyxFQUFFLFVBQVcsR0FBRztZQUMvQixNQUFNLENBQUUsR0FBRyxDQUFFLENBQUE7UUFDakIsQ0FBQyxDQUFFLENBQUE7UUFFSCxNQUFNLENBQUMsRUFBRSxDQUFFLE9B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Q0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBRSxFQUFFLENBQUUsQ0FBRSxDQUFBO0FBRWpELFFBQUEsS0FBSyxHQUFHLFVBQVcsTUFBTTtJQUNsQyxNQUFNLENBQUMsa0JBQVUsQ0FBRSxNQUFNLENBQUU7U0FDdEIsSUFBSSxDQUFFLFVBQVUsQ0FBRSxxQkFBYSxDQUFFLE1BQU0sQ0FBRSxDQUFFLENBQUU7U0FDN0MsSUFBSSxDQUFFLFVBQVUsQ0FBRSxpQkFBUyxDQUFFLE1BQU0sQ0FBRSxDQUFFLENBQUU7U0FDekMsSUFBSSxDQUFFLFVBQVUsQ0FBRSxzQkFBYyxDQUFFLE1BQU0sQ0FBRSxDQUFFLENBQUU7U0FDOUMsSUFBSSxDQUFFLFVBQVUsQ0FBRSxzQkFBYyxDQUFFLE1BQU0sQ0FBRSxDQUFFLENBQUU7U0FDOUMsSUFBSSxDQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBRSxNQUFNLENBQUUsQ0FBRTtTQUN2QyxLQUFLLENBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFFLENBQUMsQ0FBRSxDQUFFLENBQUE7QUFDdkMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXhlY0ZpbGUgfSBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiXG5pbXBvcnQgeyBMYW1iZGEsIFMzIH0gZnJvbSBcImF3cy1zZGtcIlxuXG5jb25zdCBGUyA9IHJlcXVpcmUoIFwiZnNcIiApXG5jb25zdCBQYXRoID0gcmVxdWlyZSggXCJwYXRoXCIgKVxuY29uc3QgQXJjaGl2ZXIgPSByZXF1aXJlKCBcImFyY2hpdmVyXCIgKVxuXG5jb25zdCBjd2QgPSBwcm9jZXNzLmN3ZCgpXG5jb25zdCBucG1fYmluID0gUGF0aC5qb2luKCBjd2QsIFwibm9kZV9tb2R1bGVzXCIsIFwiLmJpblwiIClcblxuZXhwb3J0IGNvbnN0IHppcE1vZHVsZSA9IGNvbmZpZyA9PiBmdW5jdGlvbiAoIG1vZHVsZV9maWxlICkge1xuICAgIGNvbnN0IG1vZHVsZV9uYW1lID0gbW9kdWxlX2ZpbGUucmVwbGFjZSggXCIudHNcIiwgXCJcIiApXG4gICAgY29uc3QgYXJjaGl2ZSA9IEFyY2hpdmVyKCBcInppcFwiIClcbiAgICBjb25zdCBhcnRpZmFjdF9maWxlID0gYCR7IGNvbmZpZy5uYW1lc3BhY2UgfS0tJHsgbW9kdWxlX25hbWUgfS56aXBgXG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoIGZ1bmN0aW9uICggcmVzb2x2ZSwgcmVqZWN0ICkge1xuICAgICAgICBjb25zdCBvdXRwdXQgPSBGUy5jcmVhdGVXcml0ZVN0cmVhbShcbiAgICAgICAgICAgIFBhdGguam9pbiggY3dkLCBjb25maWcuYnVpbGREaXIsIGFydGlmYWN0X2ZpbGUgKSApXG5cbiAgICAgICAgYXJjaGl2ZS5vbiggXCJlcnJvclwiLCBmdW5jdGlvbiAoIGVyciApIHtcbiAgICAgICAgICAgIHJlamVjdCggZXJyIClcbiAgICAgICAgfSApXG5cbiAgICAgICAgb3V0cHV0Lm9uKCBcImNsb3NlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJlc29sdmUoIG1vZHVsZV9uYW1lIClcbiAgICAgICAgfSApXG5cbiAgICAgICAgYXJjaGl2ZS5kaXJlY3RvcnkoIFBhdGguam9pbiggY3dkLCBjb25maWcuYnVpbGREaXIsIG1vZHVsZV9uYW1lICksIFwiXCIgKVxuXG4gICAgICAgIGFyY2hpdmUucGlwZSggb3V0cHV0IClcbiAgICAgICAgYXJjaGl2ZS5maW5hbGl6ZSgpXG4gICAgfSApXG59XG5cbmV4cG9ydCBjb25zdCB1cGxvYWRGdW5jdGlvbiA9IGNvbmZpZyA9PiBmdW5jdGlvbiAoIG1vZHVsZV9maWxlICkge1xuICAgIGNvbnN0IG1vZHVsZV9uYW1lID0gbW9kdWxlX2ZpbGUucmVwbGFjZSggXCIudHNcIiwgXCJcIiApXG4gICAgY29uc3QgczMgPSBuZXcgUzMoIHsgcmVnaW9uOiBjb25maWcucmVnaW9uIH0gKVxuICAgIGNvbnN0IGZ1bmN0aW9uX25hbWUgPSBgJHsgY29uZmlnLm5hbWVzcGFjZSB9LS0keyBtb2R1bGVfbmFtZSB9YFxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKCBmdW5jdGlvbiAoIHJlcywgcmVqICkge1xuICAgICAgICBGUy5yZWFkRmlsZSggYCR7IGNvbmZpZy5idWlsZERpciB9LyR7IGZ1bmN0aW9uX25hbWUgfS56aXBgLCBmdW5jdGlvbiAoIGUsIGJ1ZmZlciApIHtcblxuICAgICAgICAgICAgY29uc3QgcHV0X2NvbmZpZyA9IHtcbiAgICAgICAgICAgICAgICBCb2R5OiBidWZmZXIsXG4gICAgICAgICAgICAgICAgQnVja2V0OiBgJHsgY29uZmlnLm5hbWVzcGFjZSB9LWFydGlmYWN0c2AsXG4gICAgICAgICAgICAgICAgS2V5OiBgJHsgZnVuY3Rpb25fbmFtZSB9LnppcGBcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHMzLnB1dE9iamVjdCggcHV0X2NvbmZpZywgZnVuY3Rpb24gKCBlLCBkYXRhICkge1xuICAgICAgICAgICAgICAgIGlmICggZSApIHJlaiggZSApXG4gICAgICAgICAgICAgICAgcmVzKCBtb2R1bGVfZmlsZSApXG4gICAgICAgICAgICB9IClcbiAgICAgICAgfSApXG4gICAgfSApXG59XG5cbmV4cG9ydCBjb25zdCB1cGRhdGVGdW5jdGlvbiA9IGNvbmZpZyA9PiBmdW5jdGlvbiAoIG1vZHVsZV9maWxlICkge1xuICAgIGNvbnN0IG1vZHVsZV9uYW1lID0gbW9kdWxlX2ZpbGUucmVwbGFjZSggXCIudHNcIiwgXCJcIiApXG4gICAgY29uc3QgbGFtYmRhID0gbmV3IExhbWJkYSggeyByZWdpb246IGNvbmZpZy5yZWdpb24gfSApXG4gICAgY29uc3QgZnVuY3Rpb25fbmFtZSA9IGAkeyBjb25maWcubmFtZXNwYWNlIH0tLSR7IG1vZHVsZV9uYW1lIH1gXG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoIGZ1bmN0aW9uICggcmVzLCByZWogKSB7XG4gICAgICAgIGNvbnN0IHVwZGF0ZV9jb25maWcgPSB7XG4gICAgICAgICAgICBGdW5jdGlvbk5hbWU6IGZ1bmN0aW9uX25hbWUsXG4gICAgICAgICAgICBTM0J1Y2tldDogYCR7IGNvbmZpZy5uYW1lc3BhY2UgfS1hcnRpZmFjdHNgLFxuICAgICAgICAgICAgUzNLZXk6IGAkeyBmdW5jdGlvbl9uYW1lIH0uemlwYFxuICAgICAgICB9XG5cbiAgICAgICAgbGFtYmRhLnVwZGF0ZUZ1bmN0aW9uQ29kZSggdXBkYXRlX2NvbmZpZywgZnVuY3Rpb24gKCBlLCBkYXRhICkge1xuICAgICAgICAgICAgaWYgKCBlICkgcmVqKCBlIClcbiAgICAgICAgICAgIHJlcyggZGF0YSApXG4gICAgICAgIH0gKVxuICAgIH0gKVxufVxuXG5leHBvcnQgY29uc3QgY29tcGlsZU1vZHVsZSA9IGNvbmZpZyA9PiBmdW5jdGlvbiAoIG1vZHVsZV9maWxlICkge1xuICAgIGNvbnN0IG1vZHVsZV9uYW1lID0gbW9kdWxlX2ZpbGUucmVwbGFjZSggXCIudHNcIiwgXCJcIiApXG5cbiAgICBjb25zdCBidWlsZF9kaXIgPSBQYXRoLmpvaW4oIGN3ZCwgY29uZmlnLmJ1aWxkRGlyLCBtb2R1bGVfbmFtZSApXG4gICAgY29uc3QgaW5kZXhfZmlsZSA9IFBhdGguam9pbiggY3dkLCBjb25maWcuc291cmNlRGlyLCBtb2R1bGVfZmlsZSApXG4gICAgY29uc3QgdHNjX29wdGlvbnMgPSBbIFwiLS1vdXREaXJcIiwgYnVpbGRfZGlyLCBpbmRleF9maWxlIF1cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSggZnVuY3Rpb24gKCByZXMsIHJlaiApIHtcbiAgICAgICAgZXhlY0ZpbGUoIFBhdGguam9pbiggbnBtX2JpbiwgXCJ0c2NcIiApLCB0c2Nfb3B0aW9ucywgZnVuY3Rpb24gKCBlcnIsIHN0ZG91dCwgc3RkZXJyICkge1xuICAgICAgICAgICAgaWYgKCBlcnIgKSByZWooIGVyciApXG4gICAgICAgICAgICByZXMoIG1vZHVsZV9maWxlIClcbiAgICAgICAgfSApXG4gICAgfSApXG59XG5cbmV4cG9ydCBjb25zdCBnZXRNb2R1bGVzID0gY29uZmlnID0+IG5ldyBQcm9taXNlKCBmdW5jdGlvbiAoIHJlcywgcmVqICkge1xuICAgIEZTLnJlYWRkaXIoIGNvbmZpZy5zb3VyY2VEaXIsIGZ1bmN0aW9uICggZSwgZmlsZXMgKSB7XG4gICAgICAgIGlmICggZSApIHJlaiggZSApXG4gICAgICAgIHJlcyggZmlsZXMuZmlsdGVyKCBmID0+IGYuZW5kc1dpdGgoIFwiLnRzXCIgKSApIClcbiAgICB9IClcbn0gKVxuXG5jb25zdCBwcm9taXNlQWxsID0gZm4gPT4gbGlzdCA9PiBQcm9taXNlLmFsbCggbGlzdC5tYXAoIGZuICkgKVxuXG5leHBvcnQgY29uc3QgYnVpbGQgPSBmdW5jdGlvbiAoIGNvbmZpZyApIHtcbiAgICByZXR1cm4gZ2V0TW9kdWxlcyggY29uZmlnIClcbiAgICAgICAgLnRoZW4oIHByb21pc2VBbGwoIGNvbXBpbGVNb2R1bGUoIGNvbmZpZyApICkgKVxuICAgICAgICAudGhlbiggcHJvbWlzZUFsbCggemlwTW9kdWxlKCBjb25maWcgKSApIClcbiAgICAgICAgLnRoZW4oIHByb21pc2VBbGwoIHVwbG9hZEZ1bmN0aW9uKCBjb25maWcgKSApIClcbiAgICAgICAgLnRoZW4oIHByb21pc2VBbGwoIHVwZGF0ZUZ1bmN0aW9uKCBjb25maWcgKSApIClcbiAgICAgICAgLnRoZW4oIG91dHB1dCA9PiBjb25zb2xlLmRpciggb3V0cHV0ICkgKVxuICAgICAgICAuY2F0Y2goIGUgPT4gY29uc29sZS5sb2coIGUgKSApXG59XG5cbiJdfQ==