#!/usr/bin/env node

require( "source-map-support" ).install()

const Clients = require( "../lib/Clients" )

// Clients.configure( "src/samples/clients", "build/clients" )
//     .then( Clients.buildScripts )
//     .then( Clients.buildStyles )
//     .then( Clients.buildTemplates )
//     .then( Clients.buildStatics )
//     .then( () => console.log( "build completed" ) )
//     .catch( ( error ) => console.log( error ) )

Clients.build( "src/samples/clients", "build/clients", {} )
