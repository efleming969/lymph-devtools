import * as Express from "express"
import * as Typescript from "typescript"
import * as FS from "fs-extra"
import * as Path from "path"
import * as Pug from "pug"

import * as Styles from "./Styles"

const createPathFromRoot = root => base_name =>
    Path.join( process.cwd(), root, base_name )

const changeCase = s =>
    s.split( "-" ).map( w => w[ 0 ].toUpperCase() + w.slice( 1 ) ).join( "" )

export const run = function ( config ) {

    const app = Express()
    const pathFromRoot = createPathFromRoot( config.root )

    app.get( "/", function ( req, res ) {
        const context = { title: "hello", name: "Main" }
        Pug.renderFile( pathFromRoot( "templates/page.pug" ), context, function ( err, rendered_html ) {
            if ( err ) console.log( err )
            else res.send( rendered_html )
        } )
    } )

    app.get( "/scripts/*", function ( req, res ) {
        const source_file = pathFromRoot( req.url.replace( ".js", ".ts" ) )

        FS.readFile( source_file, "utf8", function ( err, file ) {
            if ( err ) res.send( err )
            const result = Typescript.transpileModule( file, {
                compilerOptions: {
                    module: Typescript.ModuleKind.ES2015,
                    inlineSources: true,
                    inlineSourceMap: true
                },
                fileName: source_file
            } )

            res.header( { "content-type": "application/javascript" } )
            res.send( result.outputText )
        } )
    } )

    app.get( "/styles/*", function ( req, res ) {
        const source_file = Path.join( process.cwd(), config.root, req.url )
        Styles.stream( source_file ).then( function ( css ) {
            res.header( { "content-type": "text/css" } )
            res.send( css )
        } )
    } )

    app.use( Express.static( config.root ) )

    app.listen( config.port, function () {
        console.log(
            `server running @ ${ config.port }`
        )
    } )
}
