#!/usr/bin/env node

const Services = require( "../src/Services" )

const bundle_config = {
    namespace: "lymph",
    buildDir: "build/services",
    sourceDir: "src/samples/services",
    region: "us-east-1"
}

Services.detect( bundle_config ).then( function ( services ) {
    Services.compile( bundle_config, services ).then( function () {
        Services.bundle( bundle_config, services ).then( function () {
            Services.uploadFunction( bundle_config, services ).then( function () {
                console.log( "done compiling and bundling" )
            } )
        } )
    } )
} )

