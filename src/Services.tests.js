"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Glob = require("globby");
const AWS = require("aws-sdk");
const Services = require("./Services");
const Utils_1 = require("./Utils");
const source_dir = "src/samples/services";
const bundle_config = {
    namespace: "lymph",
    buildDir: "build/services",
    sourceDir: source_dir,
    region: "us-east-1"
};
const services = [
    "src/samples/services/hello-commands.ts",
    "src/samples/services/hello-queries.ts"
];
afterAll(Utils_1.removeAllJSFiles(source_dir));
test("detecting services", function () {
    return Services.detect(bundle_config).then(function (detected_services) {
        expect(detected_services.sort()).toEqual(services);
    });
});
test("compiling services to separate build directories", function () {
    return Services.compile(bundle_config, services).then(function () {
        return Glob(bundle_config.buildDir + "/**/*.js").then(function (files) {
            expect(files.sort()).toEqual([
                "build/services/hello-commands/common/Lambda.js",
                "build/services/hello-commands/hello-commands.js",
                "build/services/hello-queries/hello-queries.js",
            ]);
        });
    });
});
test("bundling services into zip files", function () {
    return Services.bundle(bundle_config, services).then(function () {
        return Glob(bundle_config.buildDir + "/*.zip").then(function (files) {
            expect(files.sort()).toEqual([
                "build/services/lymph--hello-commands.zip",
                "build/services/lymph--hello-queries.zip",
            ]);
        });
    });
});
test("upload service bundles to s3", function () {
    const S3 = new AWS.S3({ region: bundle_config.region });
    const time_stamp = new Date().getTime() - 120000; // 2 minute buffer
    return Services.uploadFunction(bundle_config, services).then(function () {
        const params = { Bucket: "lymph-artifacts" };
        return S3.listObjectsV2(params).promise().then(function (objects) {
            const { Key, LastModified } = objects.Contents[0];
            expect(Key).toEqual("lymph--hello-commands.zip");
            expect(new Date(LastModified).getTime())
                .toBeLessThanOrEqual(time_stamp);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmljZXMudGVzdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJTZXJ2aWNlcy50ZXN0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUE4QjtBQUM5QiwrQkFBOEI7QUFFOUIsdUNBQXNDO0FBRXRDLG1DQUEwQztBQUcxQyxNQUFNLFVBQVUsR0FBRyxzQkFBc0IsQ0FBQTtBQUV6QyxNQUFNLGFBQWEsR0FBRztJQUNsQixTQUFTLEVBQUUsT0FBTztJQUNsQixRQUFRLEVBQUUsZ0JBQWdCO0lBQzFCLFNBQVMsRUFBRSxVQUFVO0lBQ3JCLE1BQU0sRUFBRSxXQUFXO0NBQ3RCLENBQUE7QUFFRCxNQUFNLFFBQVEsR0FBRztJQUNiLHdDQUF3QztJQUN4Qyx1Q0FBdUM7Q0FDMUMsQ0FBQTtBQUVELFFBQVEsQ0FBRSx3QkFBZ0IsQ0FBRSxVQUFVLENBQUUsQ0FBRSxDQUFBO0FBRTFDLElBQUksQ0FBRSxvQkFBb0IsRUFBRTtJQUN4QixNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBRSxhQUFhLENBQUUsQ0FBQyxJQUFJLENBQUUsVUFBVyxpQkFBaUI7UUFDdEUsTUFBTSxDQUFFLGlCQUFpQixDQUFDLElBQUksRUFBRSxDQUFFLENBQUMsT0FBTyxDQUFFLFFBQVEsQ0FBRSxDQUFBO0lBQzFELENBQUMsQ0FBRSxDQUFBO0FBQ1AsQ0FBQyxDQUFFLENBQUE7QUFFSCxJQUFJLENBQUUsa0RBQWtELEVBQUU7SUFDdEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUUsYUFBYSxFQUFFLFFBQVEsQ0FBRSxDQUFDLElBQUksQ0FBRTtRQUNyRCxNQUFNLENBQUMsSUFBSSxDQUFFLGFBQWEsQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFFLENBQUMsSUFBSSxDQUFFLFVBQVcsS0FBZTtZQUMvRSxNQUFNLENBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFFLENBQUMsT0FBTyxDQUFFO2dCQUM1QixnREFBZ0Q7Z0JBQ2hELGlEQUFpRDtnQkFDakQsK0NBQStDO2FBQ2xELENBQUUsQ0FBQTtRQUNQLENBQUMsQ0FBRSxDQUFBO0lBQ1AsQ0FBQyxDQUFFLENBQUE7QUFDUCxDQUFDLENBQUUsQ0FBQTtBQUVILElBQUksQ0FBRSxrQ0FBa0MsRUFBRTtJQUN0QyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBRSxhQUFhLEVBQUUsUUFBUSxDQUFFLENBQUMsSUFBSSxDQUFFO1FBQ3BELE1BQU0sQ0FBQyxJQUFJLENBQUUsYUFBYSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUUsQ0FBQyxJQUFJLENBQUUsVUFBVyxLQUFlO1lBQzdFLE1BQU0sQ0FBRSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUUsQ0FBQyxPQUFPLENBQUU7Z0JBQzVCLDBDQUEwQztnQkFDMUMseUNBQXlDO2FBQzVDLENBQUUsQ0FBQTtRQUNQLENBQUMsQ0FBRSxDQUFBO0lBQ1AsQ0FBQyxDQUFFLENBQUE7QUFDUCxDQUFDLENBQUUsQ0FBQTtBQUVILElBQUksQ0FBRSw4QkFBOEIsRUFBRTtJQUNsQyxNQUFNLEVBQUUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUUsRUFBRSxNQUFNLEVBQUUsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFFLENBQUE7SUFDekQsTUFBTSxVQUFVLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxNQUFNLENBQUEsQ0FBQyxrQkFBa0I7SUFFbkUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUUsYUFBYSxFQUFFLFFBQVEsQ0FBRSxDQUFDLElBQUksQ0FBRTtRQUM1RCxNQUFNLE1BQU0sR0FBeUIsRUFBRSxNQUFNLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQTtRQUVsRSxNQUFNLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBRSxNQUFNLENBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUUsVUFBVyxPQUFPO1lBQ2hFLE1BQU0sRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBRSxDQUFDLENBQUUsQ0FBQTtZQUVuRCxNQUFNLENBQUUsR0FBRyxDQUFFLENBQUMsT0FBTyxDQUFFLDJCQUEyQixDQUFFLENBQUE7WUFDcEQsTUFBTSxDQUFFLElBQUksSUFBSSxDQUFFLFlBQVksQ0FBRSxDQUFDLE9BQU8sRUFBRSxDQUFFO2lCQUN2QyxtQkFBbUIsQ0FBRSxVQUFVLENBQUUsQ0FBQTtRQUMxQyxDQUFDLENBQUUsQ0FBQTtJQUNQLENBQUMsQ0FBRSxDQUFBO0FBQ1AsQ0FBQyxDQUFFLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBHbG9iIGZyb20gXCJnbG9iYnlcIlxuaW1wb3J0ICogYXMgQVdTIGZyb20gXCJhd3Mtc2RrXCJcblxuaW1wb3J0ICogYXMgU2VydmljZXMgZnJvbSBcIi4vU2VydmljZXNcIlxuXG5pbXBvcnQgeyByZW1vdmVBbGxKU0ZpbGVzIH0gZnJvbSBcIi4vVXRpbHNcIlxuaW1wb3J0IHsgTGlzdE9iamVjdHNWMlJlcXVlc3QgfSBmcm9tIFwiYXdzLXNkay9jbGllbnRzL3MzXCJcblxuY29uc3Qgc291cmNlX2RpciA9IFwic3JjL3NhbXBsZXMvc2VydmljZXNcIlxuXG5jb25zdCBidW5kbGVfY29uZmlnID0ge1xuICAgIG5hbWVzcGFjZTogXCJseW1waFwiLFxuICAgIGJ1aWxkRGlyOiBcImJ1aWxkL3NlcnZpY2VzXCIsXG4gICAgc291cmNlRGlyOiBzb3VyY2VfZGlyLFxuICAgIHJlZ2lvbjogXCJ1cy1lYXN0LTFcIlxufVxuXG5jb25zdCBzZXJ2aWNlcyA9IFtcbiAgICBcInNyYy9zYW1wbGVzL3NlcnZpY2VzL2hlbGxvLWNvbW1hbmRzLnRzXCIsXG4gICAgXCJzcmMvc2FtcGxlcy9zZXJ2aWNlcy9oZWxsby1xdWVyaWVzLnRzXCJcbl1cblxuYWZ0ZXJBbGwoIHJlbW92ZUFsbEpTRmlsZXMoIHNvdXJjZV9kaXIgKSApXG5cbnRlc3QoIFwiZGV0ZWN0aW5nIHNlcnZpY2VzXCIsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gU2VydmljZXMuZGV0ZWN0KCBidW5kbGVfY29uZmlnICkudGhlbiggZnVuY3Rpb24gKCBkZXRlY3RlZF9zZXJ2aWNlcyApIHtcbiAgICAgICAgZXhwZWN0KCBkZXRlY3RlZF9zZXJ2aWNlcy5zb3J0KCkgKS50b0VxdWFsKCBzZXJ2aWNlcyApXG4gICAgfSApXG59IClcblxudGVzdCggXCJjb21waWxpbmcgc2VydmljZXMgdG8gc2VwYXJhdGUgYnVpbGQgZGlyZWN0b3JpZXNcIiwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBTZXJ2aWNlcy5jb21waWxlKCBidW5kbGVfY29uZmlnLCBzZXJ2aWNlcyApLnRoZW4oIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIEdsb2IoIGJ1bmRsZV9jb25maWcuYnVpbGREaXIgKyBcIi8qKi8qLmpzXCIgKS50aGVuKCBmdW5jdGlvbiAoIGZpbGVzOiBzdHJpbmdbXSApIHtcbiAgICAgICAgICAgIGV4cGVjdCggZmlsZXMuc29ydCgpICkudG9FcXVhbCggW1xuICAgICAgICAgICAgICAgIFwiYnVpbGQvc2VydmljZXMvaGVsbG8tY29tbWFuZHMvY29tbW9uL0xhbWJkYS5qc1wiLFxuICAgICAgICAgICAgICAgIFwiYnVpbGQvc2VydmljZXMvaGVsbG8tY29tbWFuZHMvaGVsbG8tY29tbWFuZHMuanNcIixcbiAgICAgICAgICAgICAgICBcImJ1aWxkL3NlcnZpY2VzL2hlbGxvLXF1ZXJpZXMvaGVsbG8tcXVlcmllcy5qc1wiLFxuICAgICAgICAgICAgXSApXG4gICAgICAgIH0gKVxuICAgIH0gKVxufSApXG5cbnRlc3QoIFwiYnVuZGxpbmcgc2VydmljZXMgaW50byB6aXAgZmlsZXNcIiwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBTZXJ2aWNlcy5idW5kbGUoIGJ1bmRsZV9jb25maWcsIHNlcnZpY2VzICkudGhlbiggZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gR2xvYiggYnVuZGxlX2NvbmZpZy5idWlsZERpciArIFwiLyouemlwXCIgKS50aGVuKCBmdW5jdGlvbiAoIGZpbGVzOiBzdHJpbmdbXSApIHtcbiAgICAgICAgICAgIGV4cGVjdCggZmlsZXMuc29ydCgpICkudG9FcXVhbCggW1xuICAgICAgICAgICAgICAgIFwiYnVpbGQvc2VydmljZXMvbHltcGgtLWhlbGxvLWNvbW1hbmRzLnppcFwiLFxuICAgICAgICAgICAgICAgIFwiYnVpbGQvc2VydmljZXMvbHltcGgtLWhlbGxvLXF1ZXJpZXMuemlwXCIsXG4gICAgICAgICAgICBdIClcbiAgICAgICAgfSApXG4gICAgfSApXG59IClcblxudGVzdCggXCJ1cGxvYWQgc2VydmljZSBidW5kbGVzIHRvIHMzXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBTMyA9IG5ldyBBV1MuUzMoIHsgcmVnaW9uOiBidW5kbGVfY29uZmlnLnJlZ2lvbiB9IClcbiAgICBjb25zdCB0aW1lX3N0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSAxMjAwMDAgLy8gMiBtaW51dGUgYnVmZmVyXG5cbiAgICByZXR1cm4gU2VydmljZXMudXBsb2FkRnVuY3Rpb24oIGJ1bmRsZV9jb25maWcsIHNlcnZpY2VzICkudGhlbiggZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCBwYXJhbXM6IExpc3RPYmplY3RzVjJSZXF1ZXN0ID0geyBCdWNrZXQ6IFwibHltcGgtYXJ0aWZhY3RzXCIgfVxuXG4gICAgICAgIHJldHVybiBTMy5saXN0T2JqZWN0c1YyKCBwYXJhbXMgKS5wcm9taXNlKCkudGhlbiggZnVuY3Rpb24gKCBvYmplY3RzICkge1xuICAgICAgICAgICAgY29uc3QgeyBLZXksIExhc3RNb2RpZmllZCB9ID0gb2JqZWN0cy5Db250ZW50c1sgMCBdXG5cbiAgICAgICAgICAgIGV4cGVjdCggS2V5ICkudG9FcXVhbCggXCJseW1waC0taGVsbG8tY29tbWFuZHMuemlwXCIgKVxuICAgICAgICAgICAgZXhwZWN0KCBuZXcgRGF0ZSggTGFzdE1vZGlmaWVkICkuZ2V0VGltZSgpIClcbiAgICAgICAgICAgICAgICAudG9CZUxlc3NUaGFuT3JFcXVhbCggdGltZV9zdGFtcCApXG4gICAgICAgIH0gKVxuICAgIH0gKVxufSApXG5cbiJdfQ==