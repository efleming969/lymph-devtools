import * as FS from "fs-extra"
import * as Path from "path"
import * as Glob from "globby"

import * as Clients from "./Clients"

const sample_source = Path.join( "samples", "clients", "src" )
const sample_target = Path.join( "samples", "clients", "build" )

const removeBuildDirectory = () => FS.remove( sample_target )

const removeAllJSFiles = function () {
    const js_pattern = Path.join( sample_source, "**", "*.js" )

    return Glob( js_pattern ).then( function ( js_files ) {
        return Promise.all( js_files.map( f => FS.remove( f ) ) )
    } )
}

const config = {
    dev: false,
    source: sample_source,
    target: sample_target
}

describe( "building modules", function () {

    const module_configuration = {
        name: "Main",
        title: "Main",
        styles: [
            "/styles/Main.css",
            "/styles/General.css"
        ],
        scripts: [],
        globals: {}
    }

    beforeEach( function () {
        return Clients.buildModule( config )( module_configuration )
    } )

    afterEach( removeAllJSFiles )
    afterEach( removeBuildDirectory )

    it( "compiles main module and dependent scripts to source directory", function () {
        return Glob( sample_source + "/**/*.js" ).then( function ( files: string[] ) {
            expect( files.sort() ).toEqual( [
                Path.join( sample_source, "/scripts/GreetingBuilder.js" ),
                Path.join( sample_source, "/scripts/Main.js" ),
                Path.join( sample_source, "/scripts/Simple.js" )
            ] )
        } )
    } )

    it( "creates main bundle in build directory", function () {
        return Glob( sample_target + "/**/*.js" ).then( function ( files: string[] ) {
            expect( files.sort() ).toEqual( [
                Path.join( sample_target, "/scripts/Main.js" )
            ] )
        } )
    } )

    it( "compiles styles to build directory", function () {
        return Glob( sample_target + "/**/*.css" ).then( function ( files: string[] ) {
            expect( files.sort() ).toEqual( [
                Path.join( sample_target, "styles", "General.css" ),
                Path.join( sample_target, "styles", "Main.css" )
            ] )
        } )
    } )

    it( "compiles module html entry point to the build directory", function () {
        return Glob( sample_target + "/**/*.html" ).then( function ( files: string[] ) {
            expect( files.sort() ).toEqual( [
                Path.join( sample_target, "Main.html" )
            ] )
        } )
    } )
} )

describe( "misc build options", function () {
    afterEach( removeBuildDirectory )

    test( "copy all static files to build directory", function () {
        return Clients.copyStatics( config )
            .then( () => Glob( Path.join( sample_target, "statics" ) ) )
            .then( function ( files: string[] ) {
                expect( files.sort() ).toEqual( [
                    Path.join( sample_target, "statics", "images", "favicon.ico" ),
                    Path.join( sample_target, "statics", "images", "nodejs-logo.png" )
                ] )
            } )
    } )

    test( "retrieving all module config files", function () {
        return Clients.detectModules( config ).then( function ( modules ) {
            expect( modules ).toEqual( [
                {
                    name: "Main",
                    title: "Main",
                    styles: [
                        "styles/Main.css",
                        "styles/General.css"
                    ],
                    scripts: [
                        {
                            "name": "lymph-client",
                            "iife": "LymphClient",
                            "local": "node_modules/lymph-client/dist/lymph-client.js",
                            "remote": "https://cdn.jsdelivr.net/npm/lymph-client@0.20.0/lib/lymph-client.js"
                        }
                    ],
                    globals: {}
                }
            ] )
        } )
    } )
} )

