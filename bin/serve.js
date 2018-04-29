#!/usr/bin/env node

const Server = require( "../lib/Server" )
const Path = require( "path" )

const clients_dir = Path.join( process.cwd(), "samples", "clients" )

Server.run( {
    port: 8080,
    source: Path.join( clients_dir, "src" ),
    target: Path.join( clients_dir, "dist" ),
    dependencies: {
        "ultradom": [ "ultradom" ],
        "preact": [ "preact" ]
    }
} )
