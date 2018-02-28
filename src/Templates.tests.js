"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const Templates = require("./Templates");
const Utils_1 = require("./Utils");
const dummy_config = {
    "dev": false,
    "name": "Main",
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
    return Templates.detect(source_dir).then(function (config_files) {
        expect(config_files.length).toEqual(1);
        expect(config_files[0]).toEqual(expect.objectContaining({
            name: "Main",
            title: "Main",
            styles: ["/styles/Main.css"],
        }));
    });
});
test("rendering template for a given configuration", function () {
    const result = Templates.render(dummy_config);
    expect(result).toEqual(Utils_1.multiline `
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVtcGxhdGVzLnRlc3RzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiVGVtcGxhdGVzLnRlc3RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBRTVCLHlDQUF3QztBQUN4QyxtQ0FBbUM7QUFFbkMsTUFBTSxZQUFZLEdBQUc7SUFDakIsS0FBSyxFQUFFLEtBQUs7SUFDWixNQUFNLEVBQUUsTUFBTTtJQUNkLE9BQU8sRUFBRSxNQUFNO0lBQ2YsUUFBUSxFQUFFO1FBQ04sa0JBQWtCO0tBQ3JCO0lBQ0QsU0FBUyxFQUFFO1FBQ1A7WUFDSSxNQUFNLEVBQUUsY0FBYztZQUN0QixPQUFPLEVBQUUsZ0RBQWdEO1lBQ3pELFFBQVEsRUFBRSxFQUFFO1NBQ2Y7S0FDSjtJQUNELFNBQVMsRUFBRTtRQUNQLGVBQWU7S0FDbEI7Q0FDSixDQUFBO0FBRUQsSUFBSSxDQUFFLGtEQUFrRCxFQUFFO0lBQ3RELElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUUsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFFLENBQUE7SUFFeEUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUUsVUFBVSxDQUFFLENBQUMsSUFBSSxDQUFFLFVBQVcsWUFBWTtRQUMvRCxNQUFNLENBQUUsWUFBWSxDQUFDLE1BQU0sQ0FBRSxDQUFDLE9BQU8sQ0FBRSxDQUFDLENBQUUsQ0FBQTtRQUMxQyxNQUFNLENBQUUsWUFBWSxDQUFFLENBQUMsQ0FBRSxDQUFFLENBQUMsT0FBTyxDQUFFLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBRTtZQUMxRCxJQUFJLEVBQUUsTUFBTTtZQUNaLEtBQUssRUFBRSxNQUFNO1lBQ2IsTUFBTSxFQUFFLENBQUUsa0JBQWtCLENBQUU7U0FDakMsQ0FBRSxDQUFFLENBQUE7SUFDVCxDQUFDLENBQUUsQ0FBQTtBQUNQLENBQUMsQ0FBRSxDQUFBO0FBRUgsSUFBSSxDQUFFLDhDQUE4QyxFQUFFO0lBQ2xELE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUUsWUFBWSxDQUFFLENBQUE7SUFFL0MsTUFBTSxDQUFFLE1BQU0sQ0FBRSxDQUFDLE9BQU8sQ0FBRSxpQkFBUyxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQW9CbEMsQ0FBRSxDQUFBO0FBQ1AsQ0FBQyxDQUFFLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBQYXRoIGZyb20gXCJwYXRoXCJcblxuaW1wb3J0ICogYXMgVGVtcGxhdGVzIGZyb20gXCIuL1RlbXBsYXRlc1wiXG5pbXBvcnQgeyBtdWx0aWxpbmUgfSBmcm9tIFwiLi9VdGlsc1wiXG5cbmNvbnN0IGR1bW15X2NvbmZpZyA9IHtcbiAgICBcImRldlwiOiBmYWxzZSxcbiAgICBcIm5hbWVcIjogXCJNYWluXCIsXG4gICAgXCJ0aXRsZVwiOiBcIk1haW5cIixcbiAgICBcInN0eWxlc1wiOiBbXG4gICAgICAgIFwiL3N0eWxlcy9NYWluLmNzc1wiXG4gICAgXSxcbiAgICBcInNjcmlwdHNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgICBcIm5hbWVcIjogXCJseW1waC1jbGllbnRcIixcbiAgICAgICAgICAgIFwibG9jYWxcIjogXCIvbm9kZV9tb2R1bGVzL2x5bXBoLWNsaWVudC9saWIvbHltcGgtY2xpZW50LmpzXCIsXG4gICAgICAgICAgICBcInJlbW90ZVwiOiBcIlwiXG4gICAgICAgIH1cbiAgICBdLFxuICAgIFwibW9kdWxlc1wiOiBbXG4gICAgICAgIFwiL3NjcmlwdHMvTWFpblwiXG4gICAgXVxufVxuXG50ZXN0KCBcImRldGVjdGluZyBjb25maWd1cmUgZmlsZSBmcm9tIGEgZ2l2ZW4gc291cmNlIGRpclwiLCBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHNvdXJjZV9kaXIgPSBQYXRoLmpvaW4oIHByb2Nlc3MuY3dkKCksIFwic3JjXCIsIFwic2FtcGxlc1wiLCBcImNsaWVudHNcIiApXG5cbiAgICByZXR1cm4gVGVtcGxhdGVzLmRldGVjdCggc291cmNlX2RpciApLnRoZW4oIGZ1bmN0aW9uICggY29uZmlnX2ZpbGVzICkge1xuICAgICAgICBleHBlY3QoIGNvbmZpZ19maWxlcy5sZW5ndGggKS50b0VxdWFsKCAxIClcbiAgICAgICAgZXhwZWN0KCBjb25maWdfZmlsZXNbIDAgXSApLnRvRXF1YWwoIGV4cGVjdC5vYmplY3RDb250YWluaW5nKCB7XG4gICAgICAgICAgICBuYW1lOiBcIk1haW5cIixcbiAgICAgICAgICAgIHRpdGxlOiBcIk1haW5cIixcbiAgICAgICAgICAgIHN0eWxlczogWyBcIi9zdHlsZXMvTWFpbi5jc3NcIiBdLFxuICAgICAgICB9ICkgKVxuICAgIH0gKVxufSApXG5cbnRlc3QoIFwicmVuZGVyaW5nIHRlbXBsYXRlIGZvciBhIGdpdmVuIGNvbmZpZ3VyYXRpb25cIiwgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IFRlbXBsYXRlcy5yZW5kZXIoIGR1bW15X2NvbmZpZyApXG5cbiAgICBleHBlY3QoIHJlc3VsdCApLnRvRXF1YWwoIG11bHRpbGluZWBcbiAgICAgICAgfCA8IURPQ1RZUEUgaHRtbD5cblxuICAgICAgICB8IDxodG1sIGxhbmc9XCJlblwiPlxuXG4gICAgICAgIHwgPGhlYWQ+XG4gICAgICAgIHwgICAgIDxtZXRhIGNoYXJzZXQ9XCJVVEYtOFwiPlxuICAgICAgICB8ICAgICA8bWV0YSBodHRwLWVxdWl2PVwieC11YS1jb21wYXRpYmxlXCIgY29udGVudD1cImllPWVkZ2VcIj5cbiAgICAgICAgfCAgICAgPG1ldGEgbmFtZT1cInZpZXdwb3J0XCIgY29udGVudD1cIndpZHRoPWRldmljZS13aWR0aCwgaW5pdGlhbC1zY2FsZT0xXCI+XG4gICAgICAgIHwgICAgIDx0aXRsZT5NYWluPC90aXRsZT5cblxuICAgICAgICB8ICAgICA8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cIi9zdHlsZXMvTWFpbi5jc3NcIj5cblxuICAgICAgICB8ICAgICA8c2NyaXB0IHR5cGU9XCJhcHBsaWNhdGlvbi9qYXZhc2NyaXB0XCIgc3JjPVwiXCI+PC9zY3JpcHQ+XG4gICAgICAgIHwgICAgIDxzY3JpcHQgdHlwZT1cImFwcGxpY2F0aW9uL2phdmFzY3JpcHRcIiBzcmM9XCIvc2NyaXB0cy9NYWluXCI+PC9zY3JpcHQ+XG4gICAgICAgIHwgPC9oZWFkPlxuXG4gICAgICAgIHwgPGJvZHk+PC9ib2R5PlxuXG4gICAgICAgIHwgPC9odG1sPlxuICAgIGAgKVxufSApXG4iXX0=