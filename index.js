#!/usr/bin/env node

const Commander = require( "commander" )
const Server = require( "./lib/Server" )

const result = Commander.version( "1.0.0" )
    .option( "-r, --root [path]", "path to module dir", "src" )
    .option( "-p, --port [port]", "port", 8080 )
    .parse( process.argv )

Server.run( Commander )

