import * as Express from "express"

import * as Templates from "./client/Templates"
import * as Styles from "./client/Styles"
import * as Scripts from "./client/Scripts"
import * as Assets from "./client/Assets"
import * as Modules from "./client/Modules"

import { ensureDirs } from "./client"

const runWebServer = function ( config ) {
    const app = Express()

    app.use( function ( req, res, next ) {
        const is_not_module = req.url.startsWith( "/assets" )
            || /index\.(css|js)$/g.test( req.url )
            || !req.url.endsWith( "/" )

        if ( is_not_module ) {
            next()
        }
        else {
            // underscore is the alias for the root module
            const module_name = req.url === "/" ? "_" : req.url.replace( "/", "" )

            console.log( "" )
            console.log( `Processing ${ module_name } module` )
            console.log( "--------------------------------------------------" )

            Modules.readConfig( config, module_name )
                .then( Scripts.compile( config ) )
                .then( Styles.compile( config ) )
                .then( Templates.compile( config ) )
                .then( () => next() )
                .catch( ( error ) => res.status( 500 ).send( error ) )
        }
    } )

    app.use( "/", Express.static( config.target ) )

    app.listen( config.port, function () {
        console.log( `server running @ ${ config.port }` )
    } )
}

export const run = function ( config ) {
    ensureDirs( config )
        .then( Assets.copy )
        .then( Scripts.compileDependencies )
        .then( Styles.compileDependencies )
        .then( function ( config ) {
            return Promise.all( config.modules.map( function ( module_name ) {
                return Modules.readConfig( config, module_name )
                    .then( Scripts.compile( config ) )
                    .then( Styles.compile( config ) )
                    .then( Templates.compile( config ) )
            } ) ).then( () => config )
        } )
        .then( runWebServer )
        .catch( function ( error ) {
            console.log( error )
        } )
}
