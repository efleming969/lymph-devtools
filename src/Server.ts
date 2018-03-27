import * as Express from "express"
import * as Path from "path"

import * as Templates from "./Templates"
import * as Styles from "./Styles"
import * as Scripts from "./Scripts"

const createPathFromRoot = root => base_name =>
    Path.join( process.cwd(), root, base_name )

export const run = function ( config ) {

    const app = Express()
    const pathFromRoot = createPathFromRoot( config.root )

    app.get( "/:page_name.html", function ( req, res ) {
        const name = req.params.page_name
        const directory = pathFromRoot( "." )

        res.header( { "content-type": "text/html" } )

        Templates.render( { name, directory } )
            .then( output => res.send( output ) )
            .catch( error => res.status( 404 ).send( `${ name } not found` ) )
    } )

    app.get( "/scripts/:script_name.js", function ( req, res ) {
        const name = req.params.script_name
        const directory = pathFromRoot( "scripts" )

        res.header( { "content-type": "application/javascript" } )

        Scripts.render( { name, directory } )
            .then( output => res.send( output ) )
            .catch( error => res.status( 404 ).send( `${ name } not found` ) )
    } )

    app.get( "/styles/:style_name.css", function ( req, res ) {
        const name = req.params.style_name
        const directory = pathFromRoot( "styles" )

        res.header( { "content-type": "text/css" } )

        Styles.render( { name, directory } )
            .then( output => res.send( output ) )
            .catch( error => res.status( 404 ).send( `${ name } not found` ) )
    } )

    app.use( Express.static( config.root ) )

    app.listen( config.port, function () {
        console.log( `server running @ ${ config.port }` )
    } )
}
