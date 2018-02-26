#!/usr/bin/env node
const Caporal = require( "caporal" )

const Clients = require( "../lib/Clients" )

Caporal.version( "0.11.0" )
    .command( "client", "build client application" )
    .argument( "<source>", "source directory for clients" )
    .action( function ( args, options, logger ) {
        Clients.config( args.source, "build" )
            .then( Clients.buildScripts )
            .then( Clients.buildStyles )
            .then( Clients.buildImages )
            .then( Clients.buildTemplates )
            .then( Clients.deploy )
            .then( config => logger.info( "done build clients" ) )
            .catch( error => logger.info( error ) )
    } )

Caporal.parse( process.argv )
