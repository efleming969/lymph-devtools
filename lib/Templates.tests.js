"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            "remote": "http://remote/lymph-client.js"
        }
    ],
    "modules": [
        "/scripts/Main"
    ]
};
test("rendering production template for a given configuration", function () {
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

        |     <script type="application/javascript" src="http://remote/lymph-client.js"></script>
        |     <script type="application/javascript" src="/scripts/Main.js"></script>
        | </head>

        | <body></body>

        | </html>
    `);
});
//# sourceMappingURL=Templates.tests.js.map