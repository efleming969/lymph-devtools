#!/usr/bin/env node

const Server = require( "../lib/Server" )

Server.run( {
    port: 8080,
    root: "samples/clients/src",
    dependencies: {
        "preact": "https://cdn.jsdelivr.net/npm/preact@8.2.7/dist/preact.esm.js"
    }
} )
