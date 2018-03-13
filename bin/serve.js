#!/usr/bin/env node

const Server = require( "../lib/Server" )

Server.run( {
    port: 8080,
    root: "src/samples/clients"
} )
