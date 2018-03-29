import * as Glob from "globby"
import * as Path from "path"

import { build } from "./index"

const removeRootPath = function ( path: string ) {
    return path.replace( process.cwd(), "" )
}

describe( "client build", function () {
    const samples_dir = Path.join( process.cwd(), "samples", "clients" )
    const samples_target_dir = Path.join( samples_dir, "build" )

    beforeAll( function () {
        return build( {
            source: Path.join( samples_dir, "src" ),
            target: samples_target_dir,
            bundles: [ "Main" ]
        } )
    } )

    it( "builds templates", function () {
        const template_pattern = Path.join( samples_target_dir, "*.html" )

        return Glob( template_pattern ).then( function ( results ) {
            expect( results.map( removeRootPath ).sort() ).toEqual( [
                "/samples/clients/build/Main.html"
            ] )
        } )
    } )

    it( "builds scripts", function () {
        const script_pattern = Path.join( samples_target_dir, "scripts" )

        return Glob( script_pattern ).then( function ( results ) {
            expect( results.map( removeRootPath ).sort() ).toEqual( [
                "/samples/clients/build/scripts/GreetingBuilder.js",
                "/samples/clients/build/scripts/Main.js"
            ] )
        } )
    } )

    it( "builds styles", function () {
        const script_pattern = Path.join( samples_target_dir, "styles" )

        return Glob( script_pattern ).then( function ( results ) {
            expect( results.map( removeRootPath ).sort() ).toEqual( [
                "/samples/clients/build/styles/General.css",
                "/samples/clients/build/styles/Main.css"
            ] )
        } )
    } )

    it( "builds images", function () {
        const script_pattern = Path.join( samples_target_dir, "images" )

        return Glob( script_pattern ).then( function ( results ) {
            expect( results.map( removeRootPath ).sort() ).toEqual( [
                "/samples/clients/build/images/favicon.ico",
                "/samples/clients/build/images/nodejs-logo.png"
            ] )
        } )
    } )

    it( "builds bundles for browsers that don't support es modules", function () {
        const script_pattern = Path.join( samples_target_dir, "bundles" )

        return Glob( script_pattern ).then( function ( results ) {
            expect( results.map( removeRootPath ).sort() ).toEqual( [
                "/samples/clients/build/bundles/Main.js",
            ] )
        } )
    } )
} )