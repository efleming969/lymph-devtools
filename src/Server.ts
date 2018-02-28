import * as Express from "express"
import * as Typescript from "typescript"
import * as FS from "fs-extra"
import * as Path from "path"

import * as Templates from "./Templates"
import * as Styles from "./Styles"

const createPathFromRoot = root => base_name =>
    Path.join( process.cwd(), root, base_name )

const changeCase = s =>
    s.split( "-" ).map( w => w[ 0 ].toUpperCase() + w.slice( 1 ) ).join( "" )

export const run = function ( config ) {

    const app = Express()
    const pathFromRoot = createPathFromRoot( config.root )

    app.get( "/:module_name.html", function ( req, res ) {
        const module_name = req.params.module_name
        const module_config_path = pathFromRoot( `${ module_name }.json` )

        res.header( "content-type", "text/html" )

        FS.readFile( module_config_path, "utf8" )
            .then( raw_config => JSON.parse( raw_config ) )
            .then( config => Object.assign( {}, config, { dev: true } ) )
            .then( Templates.render )
            .then( template => res.send( template ) )
    } )

    app.get( "/node_modules/*", function ( req, res ) {
        res.sendFile( Path.join( process.cwd(), req.url ) )
    } )

    app.get( "/scripts/*", function ( req, res ) {
        const source_file = pathFromRoot( req.url + ".ts" )
        const import_regex = /import (.*) from "([a-zA-Z\-]*)"/g

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

            res.send( result.outputText.replace( import_regex, function ( match, p1, p2 ) {
                return `const ${ p1 } = ${ changeCase( p2 ) }`
            } ) )

        } )
    } )

    app.get( "/styles/*", function ( req, res ) {
        const source_file = Path.join( process.cwd(), config.root, req.url )
        Styles.stream( {
            name: "",
            input: source_file,
            output: ""
        } ).then( function ( css ) {
            res.header( { "content-type": "text/css" } )
            res.send( css )
        } )
    } )

    app.use( Express.static( config.root ) )

    app.listen( config.port, function () {
        console.log( `server running @ ${ config.port }` )
    } )
}
