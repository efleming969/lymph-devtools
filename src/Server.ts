import * as Express from "express"

import * as Templates from "./client/Templates"
import * as Styles from "./client/Styles"
import * as Scripts from "./client/Scripts"
import * as Assets from "./client/Assets"
import * as Modules from "./client/Modules"

import { ensureDirs } from "./client"

export const run = function ( config ) {
    const app = Express()

    app.use( "/static", Express.static( config.target ) )

    app.get( "/:module_name", function ( req, res ) {
        const module_name = req.params.module_name

        Modules.readConfig( config, module_name )
            .then( Scripts.compile( config ) )
            .then( Styles.compile( config ) )
            .then( Templates.render( config ) )
            .then( ( rendered_template ) => res.send( rendered_template ) )
            .catch( ( error ) => res.status( 500 ).send( error ) )
    } )

    ensureDirs( config )
        .then( Assets.copy )
        .then( Scripts.compileDependencies )
        .then( Styles.compileDependencies )
        .then( function ( config ) {
            app.listen( config.port, function () {
                console.log( `server running @ ${ config.port }` )
            } )
        } )
        .catch( function ( error ) {
            console.log( error )
        } )
}
