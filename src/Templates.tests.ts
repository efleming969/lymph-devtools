import * as Path from "path"
import * as FS from "fs-extra"

import * as Templates from "./Templates"
import { multiline } from "./Utils"

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
}

test( "detecting configure file from a given source dir", function () {
    let source_dir = Path.join( process.cwd(), "src", "samples", "clients" )

    return Templates.detect( source_dir ).then( function ( templates ) {
        expect( templates.length ).toEqual( 1 )

        const template_result = templates[ 0 ]

        expect( template_result.name ).toEqual( "Main" )
        expect( template_result.text ).toEqual( "" )
        expect( template_result.config ).toEqual( dummy_config )
        expect( template_result.dev ).toBeFalsy()
    } )
} )

test( "rendering template for a given configuration", function () {
    const result = Templates.render( {
        name: "Main",
        dev: false,
        config: dummy_config,
        text: ""
    } )

    expect( result.text ).toEqual( multiline`
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
    ` )
} )

test( "write a template to the appropriate file", function () {
    const template = {
        name: "Main",
        dev: false,
        config: dummy_config,
        text: "some_template_text"
    }

    return Templates.write( "build/clients" )( template ).then( function () {
        return FS.stat( "build/clients/Main.html" ).then( function ( stat ) {
            expect( stat ).toBeDefined()
        } )
    } )
} )
