"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const FS = require("fs-extra");
const Templates = require("./Templates");
const Utils_1 = require("./Utils");
const dummy_config = {
    "title": "Main",
    "styles": [
        "/styles/Main.css"
    ],
    "scripts": [
        {
            "name": "lymph-client",
            "local": "/node_modules/lymph-client/lib/lymph-client.js",
            "remote": ""
        }
    ],
    "modules": [
        "/scripts/Main"
    ]
};
test("detecting configure file from a given source dir", function () {
    let source_dir = Path.join(process.cwd(), "src", "samples", "clients");
    return Templates.detect(source_dir).then(function (templates) {
        expect(templates.length).toEqual(1);
        const template_result = templates[0];
        expect(template_result.name).toEqual("Main");
        expect(template_result.text).toEqual("");
        expect(template_result.config).toEqual(dummy_config);
        expect(template_result.dev).toBeFalsy();
    });
});
test("rendering template for a given configuration", function () {
    const result = Templates.render({
        name: "Main",
        dev: false,
        config: dummy_config,
        text: ""
    });
    expect(result.text).toEqual(Utils_1.multiline `
        | <!DOCTYPE html>

        | <html lang="en">

        | <head>
        |     <meta charset="UTF-8">
        |     <meta http-equiv="x-ua-compatible" content="ie=edge">
        |     <meta name="viewport" content="width=device-width, initial-scale=1">
        |     <title>Main</title>

        |     <link rel="stylesheet" href="/styles/Main.css">

        |     <script type="application/javascript" src=""></script>
        |     <script type="application/javascript" src="/scripts/Main"></script>
        | </head>

        | <body></body>

        | </html>
    `);
});
test("write a template to the appropriate file", function () {
    const template = {
        name: "Main",
        dev: false,
        config: dummy_config,
        text: "some_template_text"
    };
    return Templates.write("build/clients")(template).then(function () {
        return FS.stat("build/clients/Main.html").then(function (stat) {
            expect(stat).toBeDefined();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVtcGxhdGVzLnRlc3RzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiVGVtcGxhdGVzLnRlc3RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBQzVCLCtCQUE4QjtBQUU5Qix5Q0FBd0M7QUFDeEMsbUNBQW1DO0FBRW5DLE1BQU0sWUFBWSxHQUFHO0lBQ2pCLE9BQU8sRUFBRSxNQUFNO0lBQ2YsUUFBUSxFQUFFO1FBQ04sa0JBQWtCO0tBQ3JCO0lBQ0QsU0FBUyxFQUFFO1FBQ1A7WUFDSSxNQUFNLEVBQUUsY0FBYztZQUN0QixPQUFPLEVBQUUsZ0RBQWdEO1lBQ3pELFFBQVEsRUFBRSxFQUFFO1NBQ2Y7S0FDSjtJQUNELFNBQVMsRUFBRTtRQUNQLGVBQWU7S0FDbEI7Q0FDSixDQUFBO0FBRUQsSUFBSSxDQUFFLGtEQUFrRCxFQUFFO0lBQ3RELElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUUsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFFLENBQUE7SUFFeEUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUUsVUFBVSxDQUFFLENBQUMsSUFBSSxDQUFFLFVBQVcsU0FBUztRQUM1RCxNQUFNLENBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBRSxDQUFDLE9BQU8sQ0FBRSxDQUFDLENBQUUsQ0FBQTtRQUV2QyxNQUFNLGVBQWUsR0FBRyxTQUFTLENBQUUsQ0FBQyxDQUFFLENBQUE7UUFFdEMsTUFBTSxDQUFFLGVBQWUsQ0FBQyxJQUFJLENBQUUsQ0FBQyxPQUFPLENBQUUsTUFBTSxDQUFFLENBQUE7UUFDaEQsTUFBTSxDQUFFLGVBQWUsQ0FBQyxJQUFJLENBQUUsQ0FBQyxPQUFPLENBQUUsRUFBRSxDQUFFLENBQUE7UUFDNUMsTUFBTSxDQUFFLGVBQWUsQ0FBQyxNQUFNLENBQUUsQ0FBQyxPQUFPLENBQUUsWUFBWSxDQUFFLENBQUE7UUFDeEQsTUFBTSxDQUFFLGVBQWUsQ0FBQyxHQUFHLENBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQTtJQUM3QyxDQUFDLENBQUUsQ0FBQTtBQUNQLENBQUMsQ0FBRSxDQUFBO0FBRUgsSUFBSSxDQUFFLDhDQUE4QyxFQUFFO0lBQ2xELE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUU7UUFDN0IsSUFBSSxFQUFFLE1BQU07UUFDWixHQUFHLEVBQUUsS0FBSztRQUNWLE1BQU0sRUFBRSxZQUFZO1FBQ3BCLElBQUksRUFBRSxFQUFFO0tBQ1gsQ0FBRSxDQUFBO0lBRUgsTUFBTSxDQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUUsQ0FBQyxPQUFPLENBQUUsaUJBQVMsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0FvQnZDLENBQUUsQ0FBQTtBQUNQLENBQUMsQ0FBRSxDQUFBO0FBRUgsSUFBSSxDQUFFLDBDQUEwQyxFQUFFO0lBQzlDLE1BQU0sUUFBUSxHQUFHO1FBQ2IsSUFBSSxFQUFFLE1BQU07UUFDWixHQUFHLEVBQUUsS0FBSztRQUNWLE1BQU0sRUFBRSxZQUFZO1FBQ3BCLElBQUksRUFBRSxvQkFBb0I7S0FDN0IsQ0FBQTtJQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFFLGVBQWUsQ0FBRSxDQUFFLFFBQVEsQ0FBRSxDQUFDLElBQUksQ0FBRTtRQUN4RCxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBRSx5QkFBeUIsQ0FBRSxDQUFDLElBQUksQ0FBRSxVQUFXLElBQUk7WUFDN0QsTUFBTSxDQUFFLElBQUksQ0FBRSxDQUFDLFdBQVcsRUFBRSxDQUFBO1FBQ2hDLENBQUMsQ0FBRSxDQUFBO0lBQ1AsQ0FBQyxDQUFFLENBQUE7QUFDUCxDQUFDLENBQUUsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFBhdGggZnJvbSBcInBhdGhcIlxuaW1wb3J0ICogYXMgRlMgZnJvbSBcImZzLWV4dHJhXCJcblxuaW1wb3J0ICogYXMgVGVtcGxhdGVzIGZyb20gXCIuL1RlbXBsYXRlc1wiXG5pbXBvcnQgeyBtdWx0aWxpbmUgfSBmcm9tIFwiLi9VdGlsc1wiXG5cbmNvbnN0IGR1bW15X2NvbmZpZyA9IHtcbiAgICBcInRpdGxlXCI6IFwiTWFpblwiLFxuICAgIFwic3R5bGVzXCI6IFtcbiAgICAgICAgXCIvc3R5bGVzL01haW4uY3NzXCJcbiAgICBdLFxuICAgIFwic2NyaXB0c1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImx5bXBoLWNsaWVudFwiLFxuICAgICAgICAgICAgXCJsb2NhbFwiOiBcIi9ub2RlX21vZHVsZXMvbHltcGgtY2xpZW50L2xpYi9seW1waC1jbGllbnQuanNcIixcbiAgICAgICAgICAgIFwicmVtb3RlXCI6IFwiXCJcbiAgICAgICAgfVxuICAgIF0sXG4gICAgXCJtb2R1bGVzXCI6IFtcbiAgICAgICAgXCIvc2NyaXB0cy9NYWluXCJcbiAgICBdXG59XG5cbnRlc3QoIFwiZGV0ZWN0aW5nIGNvbmZpZ3VyZSBmaWxlIGZyb20gYSBnaXZlbiBzb3VyY2UgZGlyXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgc291cmNlX2RpciA9IFBhdGguam9pbiggcHJvY2Vzcy5jd2QoKSwgXCJzcmNcIiwgXCJzYW1wbGVzXCIsIFwiY2xpZW50c1wiIClcblxuICAgIHJldHVybiBUZW1wbGF0ZXMuZGV0ZWN0KCBzb3VyY2VfZGlyICkudGhlbiggZnVuY3Rpb24gKCB0ZW1wbGF0ZXMgKSB7XG4gICAgICAgIGV4cGVjdCggdGVtcGxhdGVzLmxlbmd0aCApLnRvRXF1YWwoIDEgKVxuXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlX3Jlc3VsdCA9IHRlbXBsYXRlc1sgMCBdXG5cbiAgICAgICAgZXhwZWN0KCB0ZW1wbGF0ZV9yZXN1bHQubmFtZSApLnRvRXF1YWwoIFwiTWFpblwiIClcbiAgICAgICAgZXhwZWN0KCB0ZW1wbGF0ZV9yZXN1bHQudGV4dCApLnRvRXF1YWwoIFwiXCIgKVxuICAgICAgICBleHBlY3QoIHRlbXBsYXRlX3Jlc3VsdC5jb25maWcgKS50b0VxdWFsKCBkdW1teV9jb25maWcgKVxuICAgICAgICBleHBlY3QoIHRlbXBsYXRlX3Jlc3VsdC5kZXYgKS50b0JlRmFsc3koKVxuICAgIH0gKVxufSApXG5cbnRlc3QoIFwicmVuZGVyaW5nIHRlbXBsYXRlIGZvciBhIGdpdmVuIGNvbmZpZ3VyYXRpb25cIiwgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IFRlbXBsYXRlcy5yZW5kZXIoIHtcbiAgICAgICAgbmFtZTogXCJNYWluXCIsXG4gICAgICAgIGRldjogZmFsc2UsXG4gICAgICAgIGNvbmZpZzogZHVtbXlfY29uZmlnLFxuICAgICAgICB0ZXh0OiBcIlwiXG4gICAgfSApXG5cbiAgICBleHBlY3QoIHJlc3VsdC50ZXh0ICkudG9FcXVhbCggbXVsdGlsaW5lYFxuICAgICAgICB8IDwhRE9DVFlQRSBodG1sPlxuXG4gICAgICAgIHwgPGh0bWwgbGFuZz1cImVuXCI+XG5cbiAgICAgICAgfCA8aGVhZD5cbiAgICAgICAgfCAgICAgPG1ldGEgY2hhcnNldD1cIlVURi04XCI+XG4gICAgICAgIHwgICAgIDxtZXRhIGh0dHAtZXF1aXY9XCJ4LXVhLWNvbXBhdGlibGVcIiBjb250ZW50PVwiaWU9ZWRnZVwiPlxuICAgICAgICB8ICAgICA8bWV0YSBuYW1lPVwidmlld3BvcnRcIiBjb250ZW50PVwid2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTFcIj5cbiAgICAgICAgfCAgICAgPHRpdGxlPk1haW48L3RpdGxlPlxuXG4gICAgICAgIHwgICAgIDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiL3N0eWxlcy9NYWluLmNzc1wiPlxuXG4gICAgICAgIHwgICAgIDxzY3JpcHQgdHlwZT1cImFwcGxpY2F0aW9uL2phdmFzY3JpcHRcIiBzcmM9XCJcIj48L3NjcmlwdD5cbiAgICAgICAgfCAgICAgPHNjcmlwdCB0eXBlPVwiYXBwbGljYXRpb24vamF2YXNjcmlwdFwiIHNyYz1cIi9zY3JpcHRzL01haW5cIj48L3NjcmlwdD5cbiAgICAgICAgfCA8L2hlYWQ+XG5cbiAgICAgICAgfCA8Ym9keT48L2JvZHk+XG5cbiAgICAgICAgfCA8L2h0bWw+XG4gICAgYCApXG59IClcblxudGVzdCggXCJ3cml0ZSBhIHRlbXBsYXRlIHRvIHRoZSBhcHByb3ByaWF0ZSBmaWxlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCB0ZW1wbGF0ZSA9IHtcbiAgICAgICAgbmFtZTogXCJNYWluXCIsXG4gICAgICAgIGRldjogZmFsc2UsXG4gICAgICAgIGNvbmZpZzogZHVtbXlfY29uZmlnLFxuICAgICAgICB0ZXh0OiBcInNvbWVfdGVtcGxhdGVfdGV4dFwiXG4gICAgfVxuXG4gICAgcmV0dXJuIFRlbXBsYXRlcy53cml0ZSggXCJidWlsZC9jbGllbnRzXCIgKSggdGVtcGxhdGUgKS50aGVuKCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBGUy5zdGF0KCBcImJ1aWxkL2NsaWVudHMvTWFpbi5odG1sXCIgKS50aGVuKCBmdW5jdGlvbiAoIHN0YXQgKSB7XG4gICAgICAgICAgICBleHBlY3QoIHN0YXQgKS50b0JlRGVmaW5lZCgpXG4gICAgICAgIH0gKVxuICAgIH0gKVxufSApXG4iXX0=