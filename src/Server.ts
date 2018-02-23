import * as Express from "express"
import * as Typescript from "typescript"
import * as FS from "fs"
import * as Path from "path"

import * as Template from "./Template"

export const run = function ( config ) {

    const app = Express()

    const getESModuleIndex = function ( module_name ) {
        const module_dir = Path.join( process.cwd(), "node_modules", module_name )
        const module_package_path = Path.join( module_dir, "package.json" )

        const raw_package_config = FS.readFileSync( module_package_path, "utf8" )
        const package_config = JSON.parse( raw_package_config )

        if ( package_config.module == null ) throw "dependencies must support es modules"

        return `/node_modules/${ module_name }/${ package_config.module.replace( ".js", "" ) }`
    }

    app.get( "/:module_name.html", function ( req, res ) {
        const module_name = req.params.module_name
        const template_path = Path.join( process.cwd(), config.root, `${ module_name }.html` )

        FS.readFile( template_path, "utf8", function ( err, template ) {
            const template_config = Object.assign( {},
                config.modules[ module_name ],
                { dev: true } )

            res.send( Template.render( template, template_config ) )
        } )
    } )

    app.get( "/node_modules/*", function ( req, res ) {
        res.sendFile( Path.join( process.cwd(), req.url + ".js" ) )
    } )

    app.get( "/modules/*", function ( req, res ) {
        const source_file = Path.join( process.cwd(), config.root, req.url + ".ts" )
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
            res.send( result.outputText.replace( /from \"([a-zA-Z_\-\/]*)\"/g, function ( match, p1 ) {
                return (p1[ 0 ] === "." || p1[ 0 ] === "/")
                    ? p1
                    : `from "${ getESModuleIndex( p1 ) }"`
            } ) )
        } )
    } )

    app.use( Express.static( config.root ) )

    app.listen( config.port, function () {
        console.log( `server running @ ${ config.port }` )
    } )
}
