#!/usr/bin/env node

const Services = require( "../src/Services" )

const bundle_config = {
    namespace: "lymph",
    buildDir: "build/services",
    sourceDir: "src/samples/services",
    region: "us-east-1"
}

const compile = Services.compile( bundle_config )
const bundle = Services.bundle( bundle_config )
const upload = Services.updateFunction( bundle_config )
const update = Services.updateFunction( bundle_config )

Services.detect( bundle_config )
    .then( compile )
    .then( bundle )
    .then( upload )
    .then( update )
    .then( function ( services ) {
        console.log( "finished building the following services:" )
        console.log( services.map( s => `-- { s }` ).join( "\n" ) )
    } )
