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
const removeBuildDirectory = function () {
    return FS.remove(sample_target);
};
describe("building client scripts", function () {
    const removeAllJSFiles = function () {
        const js_pattern = Path.join(sample_source, "**", "*.js");
        return glob(js_pattern).then(function (js_files) {
            return Promise.all(js_files.map(f => FS.remove(f)));
        });
    };
    afterAll(function () {
        return removeAllJSFiles().then(removeBuildDirectory);
    });
    it("should compile scripts to source directory", function () {
        return Clients.buildScripts(config).then(function () {
            return glob("src/**/*.js").then(function (files) {
                const scripts_dir = Path.join("src", "samples", "clients", "scripts");
                expect(files.sort()).toEqual([
                    Path.join(scripts_dir, "/GreetingBuilder.js"),
                    Path.join(scripts_dir, "/Main.js"),
                    Path.join(scripts_dir, "/Simple.js")
                ]);
            });
        });
    });
    it("should create bundles in build directory", function () {
        return Clients.buildScripts(config).then(function () {
            return glob("build/**/*.js").then(function (files) {
                expect(files).toEqual(["build/clients/scripts/Main.js"]);
            });
        });
    });
});
describe("building client styles", function () {
    afterAll(function () {
        return removeBuildDirectory();
    });
    it("should compile styles to build directory", function () {
        return Clients.buildStyles(config).then(function () {
            return glob("build/**/*.css").then(function (files) {
                expect(files.sort()).toEqual([
                    "build/clients/styles/General.css",
                    "build/clients/styles/Main.css"
                ]);
            });
        });
    });
});
describe("building client templates", function () {
    afterAll(function () {
        return removeBuildDirectory();
    });
    it("should compile templates to build directory", function () {
        return Clients.buildTemplates(config).then(function () {
            return glob("build/**/*.html").then(function (files) {
                expect(files.sort()).toEqual([
                    "build/clients/Main.html",
                ]);
            });
        });
    });
});
describe("building client static files", function () {
    afterAll(function () {
        return removeBuildDirectory();
    });
    it("should copy all static files to build directory", function () {
        return Clients.buildStatics(config)
            .then(() => glob("build/clients/statics"))
            .then(function (files) {
            expect(files.sort()).toEqual([
                "build/clients/statics/nodejs-logo.png",
            ]);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpZW50cy50ZXN0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkNsaWVudHMudGVzdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBOEI7QUFDOUIsNkJBQTRCO0FBQzVCLCtCQUE4QjtBQUU5QixxQ0FBb0M7QUFFcEMsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFBO0FBQ3pCLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFFLENBQUE7QUFDbkUsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBRSxDQUFBO0FBRTFELE1BQU0sTUFBTSxHQUFHLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFLENBQUE7QUFFL0QsTUFBTSxvQkFBb0IsR0FBRztJQUN6QixNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBRSxhQUFhLENBQUUsQ0FBQTtBQUNyQyxDQUFDLENBQUE7QUFFRCxRQUFRLENBQUUseUJBQXlCLEVBQUU7SUFFakMsTUFBTSxnQkFBZ0IsR0FBRztRQUNyQixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFFLENBQUE7UUFFM0QsTUFBTSxDQUFDLElBQUksQ0FBRSxVQUFVLENBQUUsQ0FBQyxJQUFJLENBQUUsVUFBVyxRQUFRO1lBQy9DLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFFLENBQUMsQ0FBRSxDQUFFLENBQUUsQ0FBQTtRQUM3RCxDQUFDLENBQUUsQ0FBQTtJQUNQLENBQUMsQ0FBQTtJQUVELFFBQVEsQ0FBRTtRQUNOLE1BQU0s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O0lBQ2pDLENBQUMsQ0FBRSxDQUFBO0lBRUgsRUFBRSxDQUFFLGlEQUFpRCxFQUFFO1FBQ25ELE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFFLE1BQU0sQ0FBRTthQUNoQyxJQUFJLENBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFFLHVCQUF1QixDQUFFLENBQUU7YUFDN0MsSUFBSSxDQUFFLFVBQVcsS0FBZTtZQUM3QixNQUFNLENBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFFLENBQUMsT0FBTyxDQUFFO2dCQUM1Qix1Q0FBdUM7YUFDMUMsQ0FBRSxDQUFBO1FBQ1AsQ0FBQyxDQUFFLENBQUE7SUFDWCxDQUFDLENBQUUsQ0FBQTtBQUVQLENBQUMsQ0FBRSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgRlMgZnJvbSBcImZzLWV4dHJhXCJcbmltcG9ydCAqIGFzIFBhdGggZnJvbSBcInBhdGhcIlxuaW1wb3J0ICogYXMgZ2xvYiBmcm9tIFwiZ2xvYmJ5XCJcblxuaW1wb3J0ICogYXMgQ2xpZW50cyBmcm9tIFwiLi9DbGllbnRzXCJcblxuY29uc3QgY3dkID0gcHJvY2Vzcy5jd2QoKVxuY29uc3Qgc2FtcGxlX3NvdXJjZSA9IFBhdGguam9pbiggY3dkLCBcInNyY1wiLCBcInNhbXBsZXNcIiwgXCJjbGllbnRzXCIgKVxuY29uc3Qgc2FtcGxlX3RhcmdldCA9IFBhdGguam9pbiggY3dkLCBcImJ1aWxkXCIsIFwiY2xpZW50c1wiIClcblxuY29uc3QgY29uZmlnID0geyBzb3VyY2U6IHNhbXBsZV9zb3VyY2UsIHRhcmdldDogc2FtcGxlX3RhcmdldCB9XG5cbmNvbnN0IHJlbW92ZUJ1aWxkRGlyZWN0b3J5ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBGUy5yZW1vdmUoIHNhbXBsZV90YXJnZXQgKVxufVxuXG5kZXNjcmliZSggXCJidWlsZGluZyBjbGllbnQgc2NyaXB0c1wiLCBmdW5jdGlvbiAoKSB7XG5cbiAgICBjb25zdCByZW1vdmVBbGxKU0ZpbGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCBqc19wYXR0ZXJuID0gUGF0aC5qb2luKCBzYW1wbGVfc291cmNlLCBcIioqXCIsIFwiKi5qc1wiIClcblxuICAgICAgICByZXR1cm4gZ2xvYigganNfcGF0dGVybiApLnRoZW4oIGZ1bmN0aW9uICgganNfZmlsZXMgKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoIGpzX2ZpbGVzLm1hcCggZiA9PiBGUy5yZW1vdmUoIGYgKSApIClcbiAgICAgICAgfSApXG4gICAgfVxuXG4gICAgYWZ0ZXJBbGwoIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHJlbW92ZUFsbEpTRmlsZXMoKS50aGVuKCByZW1vdmVCdWlsZERpcmVjdG9yeSApXG4gICAgfSApXG5cbiAgICBpdCggXCJzaG91bGQgY29tcGlsZSBzY3JpcHRzIHRvIHNvdXJjZSBkaXJlY3RvcnlcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gQ2xpZW50cy5idWlsZFNjcmlwdHMoIGNvbmZpZyApLnRoZW4oIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBnbG9iKCBcInNyYy8qKi8qLmpzXCIgKS50aGVuKCBmdW5jdGlvbiAoIGZpbGVzOiBzdHJpbmdbXSApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzY3JpcHRzX2RpciA9IFBhdGguam9pbiggXCJzcmNcIiwgXCJzYW1wbGVzXCIsIFwiY2xpZW50c1wiLCBcInNjcmlwdHNcIiApXG4gICAgICAgICAgICAgICAgZXhwZWN0KCBmaWxlcy5zb3J0KCkgKS50b0VxdWFsKCBbXG4gICAgICAgICAgICAgICAgICAgIFBhdGguam9pbiggc2NyaXB0c19kaXIsIFwiL0dyZWV0aW5nQnVpbGRlci5qc1wiICksXG4gICAgICAgICAgICAgICAgICAgIFBhdGguam9pbiggc2NyaXB0c19kaXIsIFwiL01haW4uanNcIiApLFxuICAgICAgICAgICAgICAgICAgICBQYXRoLmpvaW4oIHNjcmlwdHNfZGlyLCBcIi9TaW1wbGUuanNcIiApXG4gICAgICAgICAgICAgICAgXSApXG4gICAgICAgICAgICB9IClcbiAgICAgICAgfSApXG4gICAgfSApXG5cbiAgICBpdCggXCJzaG91bGQgY3JlYXRlIGJ1bmRsZXMgaW4gYnVpbGQgZGlyZWN0b3J5XCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIENsaWVudHMuYnVpbGRTY3JpcHRzKCBjb25maWcgKS50aGVuKCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2xvYiggXCJidWlsZC8qKi8qLmpzXCIgKS50aGVuKCBmdW5jdGlvbiAoIGZpbGVzOiBzdHJpbmdbXSApIHtcbiAgICAgICAgICAgICAgICBleHBlY3QoIGZpbGVzICkudG9FcXVhbCggWyBcImJ1aWxkL2NsaWVudHMvc2NyaXB0cy9NYWluLmpzXCIgXSApXG4gICAgICAgICAgICB9IClcbiAgICAgICAgfSApXG4gICAgfSApXG5cbn0gKVxuXG5kZXNjcmliZSggXCJidWlsZGluZyBjbGllbnQgc3R5bGVzXCIsIGZ1bmN0aW9uICgpIHtcblxuICAgIGFmdGVyQWxsKCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiByZW1vdmVCdWlsZERpcmVjdG9yeSgpXG4gICAgfSApXG5cbiAgICBpdCggXCJzaG91bGQgY29tcGlsZSBzdHlsZXMgdG8gYnVpbGQgZGlyZWN0b3J5XCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIENsaWVudHMuYnVpbGRTdHlsZXMoIGNvbmZpZyApLnRoZW4oIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBnbG9iKCBcImJ1aWxkLyoqLyouY3NzXCIgKS50aGVuKCBmdW5jdGlvbiAoIGZpbGVzOiBzdHJpbmdbXSApIHtcbiAgICAgICAgICAgICAgICBleHBlY3QoIGZpbGVzLnNvcnQoKSApLnRvRXF1YWwoIFtcbiAgICAgICAgICAgICAgICAgICAgXCJidWlsZC9jbGllbnRzL3N0eWxlcy9HZW5lcmFsLmNzc1wiLFxuICAgICAgICAgICAgICAgICAgICBcImJ1aWxkL2NsaWVudHMvc3R5bGVzL01haW4uY3NzXCJcbiAgICAgICAgICAgICAgICBdIClcbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9IClcbiAgICB9IClcblxufSApXG5cbmRlc2NyaWJlKCBcImJ1aWxkaW5nIGNsaWVudCB0ZW1wbGF0ZXNcIiwgZnVuY3Rpb24gKCkge1xuXG4gICAgYWZ0ZXJBbGwoIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHJlbW92ZUJ1aWxkRGlyZWN0b3J5KClcbiAgICB9IClcblxuICAgIGl0KCBcInNob3VsZCBjb21waWxlIHRlbXBsYXRlcyB0byBidWlsZCBkaXJlY3RvcnlcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gQ2xpZW50cy5idWlsZFRlbXBsYXRlcyggY29uZmlnICkudGhlbiggZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGdsb2IoIFwiYnVpbGQvKiovKi5odG1sXCIgKS50aGVuKCBmdW5jdGlvbiAoIGZpbGVzOiBzdHJpbmdbXSApIHtcbiAgICAgICAgICAgICAgICBleHBlY3QoIGZpbGVzLnNvcnQoKSApLnRvRXF1YWwoIFtcbiAgICAgICAgICAgICAgICAgICAgXCJidWlsZC9jbGllbnRzL01haW4uaHRtbFwiLFxuICAgICAgICAgICAgICAgIF0gKVxuICAgICAgICAgICAgfSApXG4gICAgICAgIH0gKVxuICAgIH0gKVxuXG59IClcblxuZGVzY3JpYmUoIFwiYnVpbGRpbmcgY2xpZW50IHN0YXRpYyBmaWxlc1wiLCBmdW5jdGlvbiAoKSB7XG5cbiAgICBhZnRlckFsbCggZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gcmVtb3ZlQnVpbGREaXJlY3RvcnkoKVxuICAgIH0gKVxuXG4gICAgaXQoIFwic2hvdWxkIGNvcHkgYWxsIHN0YXRpYyBmaWxlcyB0byBidWlsZCBkaXJlY3RvcnlcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gQ2xpZW50cy5idWlsZFN0YXRpY3MoIGNvbmZpZyApXG4gICAgICAgICAgICAudGhlbiggKCkgPT4gZ2xvYiggXCJidWlsZC9jbGllbnRzL3N0YXRpY3NcIiApIClcbiAgICAgICAgICAgIC50aGVuKCBmdW5jdGlvbiAoIGZpbGVzOiBzdHJpbmdbXSApIHtcbiAgICAgICAgICAgICAgICBleHBlY3QoIGZpbGVzLnNvcnQoKSApLnRvRXF1YWwoIFtcbiAgICAgICAgICAgICAgICAgICAgXCJidWlsZC9jbGllbnRzL3N0YXRpY3Mvbm9kZWpzLWxvZ28ucG5nXCIsXG4gICAgICAgICAgICAgICAgXSApXG4gICAgICAgICAgICB9IClcbiAgICB9IClcblxufSApXG5cbiJdfQ==