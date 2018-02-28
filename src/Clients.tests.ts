import * as FS from "fs-extra"
import * as Path from "path"
import * as glob from "globby"

import * as Clients from "./Clients"

const sample_source = Path.join( "src", "samples", "clients" )
const sample_target = Path.join( "build", "clients" )

const config = { source: sample_source, target: sample_target }

const removeBuildDirectory = () => FS.remove( sample_target )

const removeAllJSFiles = function () {
    const js_pattern = Path.join( sample_source, "**", "*.js" )

    return glob( js_pattern ).then( function ( js_files ) {
        return Promise.all( js_files.map( f => FS.remove( f ) ) )
    } )
}

afterAll( removeAllJSFiles )
afterAll( removeBuildDirectory )

test( "compile scripts to source directory", function () {
    return Clients.buildScripts( config ).then( function () {
        const scripts_dir = Path.join( "src", "samples", "clients", "scripts" )
        return glob( "src/samples/clients/**/*.js" ).then( function ( files: string[] ) {
            expect( files.sort() ).toEqual( [
                Path.join( scripts_dir, "/GreetingBuilder.js" ),
                Path.join( scripts_dir, "/Main.js" ),
                Path.join( scripts_dir, "/Simple.js" )
            ] )
        } )
    } )
} )

test( "creating bundles in build directory", function () {
    return Clients.buildScripts( config ).then( function () {
        return glob( "build/**/*.js" ).then( function ( files: string[] ) {
            expect( files ).toEqual( [ "build/clients/scripts/Main.js" ] )
        } )
    } )
} )

test( "compiling styles to build directory", function () {
    return Clients.buildStyles( config ).then( function () {
        return glob( "build/**/*.css" ).then( function ( files: string[] ) {
            expect( files.sort() ).toEqual( [
                "build/clients/styles/General.css",
                "build/clients/styles/Main.css"
            ] )
        } )
    } )
} )


test( "compiling templates to build directory", function () {
    return Clients.buildTemplates( config ).then( function () {
        return glob( "build/**/*.html" ).then( function ( files: string[] ) {
            expect( files.sort() ).toEqual( [
                "build/clients/Main.html",
            ] )
        } )
    } )
} )

test( "copy all static files to build directory", function () {
    return Clients.buildStatics( config )
        .then( () => glob( "build/clients/statics" ) )
        .then( function ( files: string[] ) {
            expect( files.sort() ).toEqual( [
                "build/clients/statics/nodejs-logo.png",
            ] )
        } )
} )
