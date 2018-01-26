#!/usr/bin/env node

const Commander = require( "commander" )
const Server = require( "./lib/src/Server" )

Commander.version( "1.0.0" )
    .option( "-p, --port <port>", "port", 8080 )
    .parse( process.argv )

Server.run( Commander )

