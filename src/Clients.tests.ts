import * as FS from "fs-extra"
import * as Path from "path"
import * as glob from "globby"

import * as Clients from "./Clients"

const cwd = process.cwd()
const sample_source = Path.join( cwd, "src", "samples", "clients" )
const sample_target = Path.join( cwd, "build", "clients" )

const config = { source: sample_source, target: sample_target }

const removeBuildDirectory = function () {
    return FS.remove( sample_target )
}

describe( "building client scripts", function () {

    const removeAllJSFiles = function () {
        const js_pattern = Path.join( sample_source, "**", "*.js" )

        return glob( js_pattern ).then( function ( js_files ) {
            return Promise.all( js_files.map( f => FS.remove( f ) ) )
        } )
    }

    afterAll( function () {
        return removeAllJSFiles().then( removeBuildDirectory )
    } )

    it( "should compile scripts to source directory", function () {
        return Clients.buildScripts( config ).then( function () {
            return glob( "src/**/*.js" ).then( function ( files: string[] ) {
                const scripts_dir = Path.join( "src", "samples", "clients", "scripts" )
                expect( files.sort() ).toEqual( [
                    Path.join( scripts_dir, "/GreetingBuilder.js" ),
                    Path.join( scripts_dir, "/Main.js" ),
                    Path.join( scripts_dir, "/Simple.js" )
                ] )
            } )
        } )
    } )

    it( "should create bundles in build directory", function () {
        return Clients.buildScripts( config ).then( function () {
            return glob( "build/**/*.js" ).then( function ( files: string[] ) {
                expect( files ).toEqual( [ "build/clients/scripts/Main.js" ] )
            } )
        } )
    } )

} )

describe( "building client styles", function () {

    afterAll( function () {
        return removeBuildDirectory()
    } )

    it( "should compile styles to build directory", function () {
        return Clients.buildStyles( config ).then( function () {
            return glob( "build/**/*.css" ).then( function ( files: string[] ) {
                expect( files.sort() ).toEqual( [
                    "build/clients/styles/General.css",
                    "build/clients/styles/Main.css"
                ] )
            } )
        } )
    } )

} )

describe( "building client templates", function () {

    afterAll( function () {
        return removeBuildDirectory()
    } )

    it( "should compile templates to build directory", function () {
        return Clients.buildTemplates( config ).then( function () {
            return glob( "build/**/*.html" ).then( function ( files: string[] ) {
                expect( files.sort() ).toEqual( [
                    "build/clients/Main.html",
                ] )
            } )
        } )
    } )

} )

describe( "building client static files", function () {

    afterAll( function () {
        return removeBuildDirectory()
    } )

    it( "should copy all static files to build directory", function () {
        return Clients.buildStatics( config )
            .then( () => glob( "build/clients/statics" ) )
            .then( function ( files: string[] ) {
                expect( files.sort() ).toEqual( [
                    "build/clients/statics/nodejs-logo.png",
                ] )
            } )
    } )

} )

