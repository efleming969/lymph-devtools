import * as Express from "express"
import * as Typescript from "typescript"
import * as FS from "fs"
import * as Path from "path"
import * as Mustache from "mustache"

export const run = function ( config ) {

    const app = Express()

    const defaultRootTemplate = ( modules ) => `<!doctype html>
    <html>
        <head></head>
        <body>
            <h1>Lymph DevTools</h1>
            <ul>${ modules.map( m => `<li> <a href="/modules/${m}/index.html">${m}</a></li>` ).join( "" ) }</ul>
        </body>
    </html>
`

    app.get( "/", function ( req, res ) {
        FS.readdir( Path.join( process.cwd(), "src", "modules" ), function ( err, modules ) {
            res.send( defaultRootTemplate( modules ) )
        } )
    } )

    app.get( "/modules/:module_name/index.html", function ( req, res ) {
        const module_name = req.params.module_name
        const template_dir = Path.join( process.cwd(), "src", "modules", module_name )
        const template_path = Path.join( template_dir, "index.html" )
        const template_config_path = Path.join( template_dir, "index.json" )

        FS.readFile( template_config_path, "utf8", function ( err, raw_config ) {
            const config = JSON.parse( raw_config.replace( /"{([a-zA-Z_]*)}"/, function ( match, env_name ) {
                return '"' + process.env[ env_name ] + '"'
            } ) )
            FS.readFile( template_path, "utf8", function ( err, template ) {
                res.send( Mustache.render( template, config ) )
            } )
        } )
    } )

    app.use( Express.static( "src" ) )

    app.get( "/node_modules/:module_name", function ( req, res ) {
        const module_name = req.params.module_name
        const module_dir = Path.join( process.cwd(), "node_modules", module_name )
        const module_package_path = Path.join( module_dir, "package.json" )

        FS.readFile( module_package_path, "utf8", function ( err, raw_package_config ) {
            const package_config = JSON.parse( raw_package_config )
            res.redirect( `/node_modules/${module_name}/${package_config.main.replace( ".js", "" )}` )
        } )
    } )

    app.get( "/node_modules/*", function ( req, res ) {
        res.sendFile( Path.join( process.cwd(), req.url + ".js" ) )
    } )

    app.get( /\/(modules|components)\/*/, function ( req, res ) {
        const source_file = Path.join( process.cwd(), "src", req.url.replace( ".js", "" ) + ".ts" )
        console.log( "transpiling", source_file )
        FS.readFile( source_file, "utf8", function ( err, file ) {
            const result = Typescript.transpileModule( file, {
                compilerOptions: {
                    module: Typescript.ModuleKind.ES2015,
                    inlineSources: true,
                    inlineSourceMap: true
                },
                fileName: source_file
            } )
            res.header( { "content-type": "application/javascript" } )
            res.send( result.outputText.replace( /from \"([a-z\-\/]*)\"/, function ( match, p1 ) {
                return `from "/node_modules/${ p1 }"`
            } ) )
        } )
    } )

    app.listen( config.port, function () {
        console.log( `server running @ ${ config.port }` )
    } )
}
