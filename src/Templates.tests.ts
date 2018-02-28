import * as Path from "path"

import * as Templates from "./Templates"
import { multiline } from "./Utils"

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
}

test( "detecting configure file from a given source dir", function () {
    let source_dir = Path.join( process.cwd(), "src", "samples", "clients" )

    return Templates.detect( source_dir ).then( function ( config_files ) {
        expect( config_files.length ).toEqual( 1 )
        expect( config_files[ 0 ] ).toEqual( expect.objectContaining( {
            name: "Main",
            title: "Main",
            styles: [ "/styles/Main.css" ],
        } ) )
    } )
} )

test( "rendering template for a given configuration", function () {
    const result = Templates.render( dummy_config )

    expect( result ).toEqual( multiline`
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
