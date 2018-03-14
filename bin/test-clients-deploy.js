#!/usr/bin/env node

const Clients = require( "../lib/Clients" )

Clients.deploy( "samples/clients/build", "lymph", "us-east-1" )
    .then( () => console.log( "build completed" ) )
    .catch( ( error ) => console.log( error ) )
