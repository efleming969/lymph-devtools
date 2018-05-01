import * as Express from "express"
import * as Path from "path"

import * as Templates from "./client/Templates"
import * as Styles from "./client/Styles"
import * as Scripts from "./client/Scripts"
import * as Assets from "./client/Assets"
import * as Modules from "./client/Modules"

import { ensureDirs } from "./client"

export const run = function ( config ) {
    const app = Express()

    app.get( "/:module_name/", function ( req, res ) {
        const module_name = req.params.module_name
        const module_file_path = Path.join( config.target, module_name, "index.html" )

        console.log( "" )
        console.log( `Processing ${ module_name } module` )
        console.log( "--------------------------------------------------" )

        Modules.readConfig( config, module_name )
            .then( Scripts.compile( config ) )
            .then( Styles.compile( config ) )
            .then( Templates.compile( config ) )
            .then( () => res.sendFile( module_file_path ) )
            .catch( ( error ) => res.status( 500 ).send( error ) )
    } )

    app.use( "/", Express.static( config.target ) )

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
        .then( function ( config ) {
            app.listen( config.port, function () {
                console.log( `server running @ ${ config.port }` )
            } )
        } )
        .catch( function ( error ) {
            console.log( error )
        } )
}
