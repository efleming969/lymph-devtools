#!/usr/bin/env node
const Caporal = require( "caporal" )

const Clients = require( "../lib/Clients" )

Caporal.version( "0.12.0" )
    .command( "build-clients", "build clients" )
    .argument( "<source>", "source directory for clients" )
    .action( function ( args, options, logger ) {
        Clients.configure( args.source, "build" )
            .then( Clients.buildScripts )
            .then( Clients.buildStyles )
            .then( Clients.buildTemplates )
            .then( Clients.buildStatics )
            .then( config => logger.info( "done build clients" ) )
            .catch( error => logger.info( error ) )
    } )
    .command( "deploy-clients", "deploy clients to Amazon S3" )
    .argument( "<source>", "directory to deploy from" )
    .argument( "<target>", "S3 bucket to deploy to" )
    .action( function ( args, options, logger ) {
        Clients.deploy( args.source, args.target, "us-east-1" )
            .then( () => logger.info( "done deploying clients" ) )
            .catch( ( error ) => logger.info( error ) )
    } )

Caporal.parse( process.argv )
