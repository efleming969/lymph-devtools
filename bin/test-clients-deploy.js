#!/usr/bin/env node

const Clients = require( "../src/Clients" )

Clients.deploy( "build/clients", "braintrustops", "us-east-1" )
    .then( () => console.log( "build completed" ) )
    .catch( ( error ) => console.log( error ) )
