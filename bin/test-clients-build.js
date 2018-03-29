#!/usr/bin/env node

require( "source-map-support" ).install()

const Clients = require( "../lib/client" )

const config = {
    source: "samples/clients/src",
    target: "samples/clients/build",
    bundles: [ "Main" ]
}

Clients.build( config )
    .then( () => console.log( "build completed" ) )
    .catch( ( error ) => console.log( error ) )
