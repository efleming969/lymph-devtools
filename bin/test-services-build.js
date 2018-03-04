#!/usr/bin/env node

require( "source-map-support" ).install()

const Services = require( "../lib/Services" )

const bundle_config = {
    namespace: "lymph",
    buildDir: "build/services",
    sourceDir: "src/samples/services",
    region: "us-east-1"
}

const compile = Services.compile( bundle_config )
const bundle = Services.bundle( bundle_config )
const archive = Services.archive( bundle_config )
const upload = Services.uploadFunction( bundle_config )
const update = Services.updateFunction( bundle_config )

Services.detect( bundle_config )
    .then( compile )
    .then( bundle )
    .then( archive )
    .then( upload )
    .then( update )
    .catch( err => console.log( err ) )
