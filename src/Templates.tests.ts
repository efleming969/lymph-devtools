import * as Templates from "./Templates"
import { multiline } from "./Utils"

const module_configuration = {
    name: "Main",
    title: "Main",
    styles: [ "styles/Main.css", "styles/General.css" ],
    scripts: [
        {
            name: "lymph-client",
            iife: "LymphClient",
            local: "/node_modules/lymph-client/dist/lymph-client.js",
            remote: "http://remote/lymph-client.js"
        }
    ],
    globals: {}
}

const config = {
    dev: false,
    source: "",
    target: ""
}

test( "rendering production template for a given configuration", function () {
    const result = Templates.render( config )( module_configuration )

    expect( result ).toEqual( multiline`
        | <!DOCTYPE html>

        | <html lang="en">

        | <head>
        |     <meta charset="UTF-8">
        |     <meta http-equiv="x-ua-compatible" content="ie=edge">
        |     <meta name="viewport" content="width=device-width, initial-scale=1">
        |     <title>Main</title>
        |     <link rel="icon" href="statics/images/favicon.ico">

        |     <link rel="stylesheet" href="styles/Main.css">
        |     <link rel="stylesheet" href="styles/General.css">

        |     <script type="application/javascript" src="http://remote/lymph-client.js"></script>
        |     <script type="application/javascript" src="scripts/Main.js" defer></script>
        | </head>

        | <body></body>

        | </html>
    ` )
} )

