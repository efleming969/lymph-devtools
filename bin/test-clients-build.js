#!/usr/bin/env node

require( "source-map-support" ).install()

const Clients = require( "../lib/Clients" )

const config = {
    dev: false,
    source: "samples/clients/src",
    target: "samples/clients/build"
}

Clients.detectModules( config ).then( function ( modules ) {
    console.log( "detected", modules )

    return Promise.all( modules.map( Clients.buildModule( config ) ) )
} )
    .then( () => Clients.copyStatics( config ) )
    .then( () => console.log( "build completed" ) )
    .catch( ( error ) => console.log( error ) )
