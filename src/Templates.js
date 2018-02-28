"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FS = require("fs-extra");
const Path = require("path");
const Glob = require("globby");
const Utils_1 = require("./Utils");
const renderStyle = style => `<link rel="stylesheet" href="${style}">`;
const renderModule = is_dev => function (path) {
    const type = is_dev ? "module" : "application/javascript";
    return `<script type="${type}" src="${path}"></script>`;
};
const renderScript = is_dev => function (script) {
    const path = is_dev ? script.local : script.remote;
    return `<script type="application/javascript" src="${path}"></script>`;
};
exports.render = function (config) {
    return Utils_1.multiline `
        | <!DOCTYPE html>

        | <html lang="en">

        | <head>
        |     <meta charset="UTF-8">
        |     <meta http-equiv="x-ua-compatible" content="ie=edge">
        |     <meta name="viewport" content="width=device-width, initial-scale=1">
        |     <title>${config.title}</title>

        |     ${config.styles.map(renderStyle).join("")}

        |     ${config.scripts.map(renderScript(config.dev)).join("")}
        |     ${config.modules.map(renderModule(config.dev)).join("")}
        | </head>

        | <body></body>

        | </html>
    `;
};
exports.detect = function (source_dir) {
    const config_file_pattern = Path.join(source_dir, "*.json");
    return Glob(config_file_pattern).then(function (config_file_paths) {
        const readFilePromises = config_file_paths.map(function (config_file_path) {
            return FS.readFile(config_file_path, "utf8")
                .then(config_string => JSON.parse(config_string));
        });
        return Promise.all(readFilePromises);
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVtcGxhdGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiVGVtcGxhdGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQThCO0FBQzlCLDZCQUE0QjtBQUM1QiwrQkFBOEI7QUFFOUIsbUNBQW1DO0FBc0JuQyxNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLGdDQUFnQyxLQUFLLElBQUksQ0FBQTtBQUV0RSxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDLFVBQVcsSUFBSTtJQUMxQyxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsd0JBQXdCLENBQUE7SUFDekQsTUFBTSxDQUFDLGlCQUFpQixJQUFJLFVBQVUsSUFBSSxhQUFhLENBQUE7QUFDM0QsQ0FBQyxDQUFBO0FBRUQsTUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFXLE1BQXNCO0lBQzVELE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQTtJQUNsRCxNQUFNLENBQUMsOENBQThDLElBQUksYUFBYSxDQUFBO0FBQzFFLENBQUMsQ0FBQTtBQUVZLFFBQUEsTUFBTSxHQUFHLFVBQVcsTUFBc0I7SUFDbkQsTUFBTSxDQUFDLGlCQUFTLENBQUE7Ozs7Ozs7Ozt1QkFTRyxNQUFNLENBQUMsS0FBSzs7Z0JBRWxCLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFFLFdBQVcsQ0FBRSxDQUFDLElBQUksQ0FBRSxFQUFFLENBQUc7O2dCQUU1QyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBRSxZQUFZLENBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBRSxDQUFFLENBQUMsSUFBSSxDQUFFLEVBQUUsQ0FBRTtnQkFDM0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUUsWUFBWSxDQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUUsQ0FBRSxDQUFDLElBQUksQ0FBRSxFQUFFLENBQUU7Ozs7OztLQU12RSxDQUFBO0FBQ0wsQ0FBQyxDQUFBO0FBRVksUUFBQSxNQUFNLEdBQUcsVUFBVyxVQUFrQjtJQUMvQyxNQUFNLG1CQUFtQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBRSxDQUFBO0lBRTdELE1BQU0sQ0FBQyxJQUFJLENBQUUsbUJBQW1CLENBQUUsQ0FBQyxJQUFJLENBQUUsVUFBVyxpQkFBaUI7UUFDakUsTUFBTSxnQkFBZ0IsR0FBRyxpQkFBaUIsQ0FBQyxHQUFHLENBQUUsVUFBVyxnQkFBZ0I7WUFDdkUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUUsZ0JBQWdCLEVBQUUsTUFBTSxDQUFFO2lCQUN6QyxJQUFJLENBQUUsYUFBYSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFFLGFBQWEsQ0FBb0IsQ0FBRSxDQUFBO1FBQy9FLENBQUMsQ0FBRSxDQUFBO1FBRUgsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUUsZ0JBQWdCLENBQUUsQ0FBQTtJQUMxQyxDQUFDLENBQUUsQ0FBQTtBQUNQLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEZTIGZyb20gXCJmcy1leHRyYVwiXG5pbXBvcnQgKiBhcyBQYXRoIGZyb20gXCJwYXRoXCJcbmltcG9ydCAqIGFzIEdsb2IgZnJvbSBcImdsb2JieVwiXG5cbmltcG9ydCB7IG11bHRpbGluZSB9IGZyb20gXCIuL1V0aWxzXCJcblxuZXhwb3J0IHR5cGUgVGVtcGxhdGVTY3JpcHQgPSB7XG4gICAgbmFtZTogc3RyaW5nLFxuICAgIGxvY2FsOiBzdHJpbmcsXG4gICAgcmVtb3RlOiBzdHJpbmdcbn1cblxuZXhwb3J0IHR5cGUgVGVtcGxhdGVDb25maWcgPSB7XG4gICAgbmFtZTogc3RyaW5nLFxuICAgIGRldjogYm9vbGVhbixcbiAgICB0aXRsZTogc3RyaW5nLFxuICAgIHN0eWxlczogc3RyaW5nW10sXG4gICAgc2NyaXB0czogVGVtcGxhdGVTY3JpcHRbXSxcbiAgICBtb2R1bGVzOiBzdHJpbmdbXVxufVxuXG5leHBvcnQgdHlwZSBUZW1wbGF0ZSA9IHtcbiAgICBzb3VyY2U6IHN0cmluZyxcbiAgICB0YXJnZXQ6IHN0cmluZ1xufVxuXG5jb25zdCByZW5kZXJTdHlsZSA9IHN0eWxlID0+IGA8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cIiR7c3R5bGV9XCI+YFxuXG5jb25zdCByZW5kZXJNb2R1bGUgPSBpc19kZXYgPT4gZnVuY3Rpb24gKCBwYXRoICkge1xuICAgIGNvbnN0IHR5cGUgPSBpc19kZXYgPyBcIm1vZHVsZVwiIDogXCJhcHBsaWNhdGlvbi9qYXZhc2NyaXB0XCJcbiAgICByZXR1cm4gYDxzY3JpcHQgdHlwZT1cIiR7dHlwZX1cIiBzcmM9XCIke3BhdGh9XCI+PC9zY3JpcHQ+YFxufVxuXG5jb25zdCByZW5kZXJTY3JpcHQgPSBpc19kZXYgPT4gZnVuY3Rpb24gKCBzY3JpcHQ6IFRlbXBsYXRlU2NyaXB0ICkge1xuICAgIGNvbnN0IHBhdGggPSBpc19kZXYgPyBzY3JpcHQubG9jYWwgOiBzY3JpcHQucmVtb3RlXG4gICAgcmV0dXJuIGA8c2NyaXB0IHR5cGU9XCJhcHBsaWNhdGlvbi9qYXZhc2NyaXB0XCIgc3JjPVwiJHtwYXRofVwiPjwvc2NyaXB0PmBcbn1cblxuZXhwb3J0IGNvbnN0IHJlbmRlciA9IGZ1bmN0aW9uICggY29uZmlnOiBUZW1wbGF0ZUNvbmZpZyApIHtcbiAgICByZXR1cm4gbXVsdGlsaW5lYFxuICAgICAgICB8IDwhRE9DVFlQRSBodG1sPlxuXG4gICAgICAgIHwgPGh0bWwgbGFuZz1cImVuXCI+XG5cbiAgICAgICAgfCA8aGVhZD5cbiAgICAgICAgfCAgICAgPG1ldGEgY2hhcnNldD1cIlVURi04XCI+XG4gICAgICAgIHwgICAgIDxtZXRhIGh0dHAtZXF1aXY9XCJ4LXVhLWNvbXBhdGlibGVcIiBjb250ZW50PVwiaWU9ZWRnZVwiPlxuICAgICAgICB8ICAgICA8bWV0YSBuYW1lPVwidmlld3BvcnRcIiBjb250ZW50PVwid2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTFcIj5cbiAgICAgICAgfCAgICAgPHRpdGxlPiR7Y29uZmlnLnRpdGxlfTwvdGl0bGU+XG5cbiAgICAgICAgfCAgICAgJHsgY29uZmlnLnN0eWxlcy5tYXAoIHJlbmRlclN0eWxlICkuam9pbiggXCJcIiApIH1cblxuICAgICAgICB8ICAgICAkeyBjb25maWcuc2NyaXB0cy5tYXAoIHJlbmRlclNjcmlwdCggY29uZmlnLmRldiApICkuam9pbiggXCJcIiApfVxuICAgICAgICB8ICAgICAkeyBjb25maWcubW9kdWxlcy5tYXAoIHJlbmRlck1vZHVsZSggY29uZmlnLmRldiApICkuam9pbiggXCJcIiApfVxuICAgICAgICB8IDwvaGVhZD5cblxuICAgICAgICB8IDxib2R5PjwvYm9keT5cblxuICAgICAgICB8IDwvaHRtbD5cbiAgICBgXG59XG5cbmV4cG9ydCBjb25zdCBkZXRlY3QgPSBmdW5jdGlvbiAoIHNvdXJjZV9kaXI6IHN0cmluZyApOiBQcm9taXNlPFRlbXBsYXRlQ29uZmlnW10+IHtcbiAgICBjb25zdCBjb25maWdfZmlsZV9wYXR0ZXJuID0gUGF0aC5qb2luKCBzb3VyY2VfZGlyLCBcIiouanNvblwiIClcblxuICAgIHJldHVybiBHbG9iKCBjb25maWdfZmlsZV9wYXR0ZXJuICkudGhlbiggZnVuY3Rpb24gKCBjb25maWdfZmlsZV9wYXRocyApIHtcbiAgICAgICAgY29uc3QgcmVhZEZpbGVQcm9taXNlcyA9IGNvbmZpZ19maWxlX3BhdGhzLm1hcCggZnVuY3Rpb24gKCBjb25maWdfZmlsZV9wYXRoICkge1xuICAgICAgICAgICAgcmV0dXJuIEZTLnJlYWRGaWxlKCBjb25maWdfZmlsZV9wYXRoLCBcInV0ZjhcIiApXG4gICAgICAgICAgICAgICAgLnRoZW4oIGNvbmZpZ19zdHJpbmcgPT4gSlNPTi5wYXJzZSggY29uZmlnX3N0cmluZyApIGFzIFRlbXBsYXRlQ29uZmlnIClcbiAgICAgICAgfSApXG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKCByZWFkRmlsZVByb21pc2VzIClcbiAgICB9IClcbn1cbiJdfQ==