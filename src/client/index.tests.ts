import * as Glob from "globby"
import * as Path from "path"
import * as AWS from "aws-sdk"

import { build, deploy } from "./index"

const removeRootPath = function ( path: string ) {
    return path.replace( process.cwd(), "" )
}

const samples_dir = Path.join( process.cwd(), "samples", "clients" )
const samples_target_dir = Path.join( samples_dir, "build" )

const build_config = {
    source: Path.join( samples_dir, "src" ),
    target: samples_target_dir,
    bundles: [ "Main" ]
}

describe( "client build", function () {

    beforeAll( function () {
        return build( build_config )
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

describe( "client deploy", function () {
    const s3 = new AWS.S3( { region: "us-east-1" } )

    beforeAll( function () {
        const put_dummy_config = {
            Body: Buffer.from( "dummy-data" ),
            Bucket: "lymph",
            Key: "extra-file.txt"
        }

        return s3.putObject( put_dummy_config ).promise()
            .then( () => build( build_config ) )
            .then( () => deploy( samples_target_dir, "lymph", "us-east-1" ) )
    } )

    it( "uploaded new files to s3 and remove extras", function () {
        return s3.listObjectsV2( { Bucket: "lymph" } ).promise().then( function ( results ) {
            expect( results.Contents.map( o => o.Key ) ).toEqual( [
                "Main.html",
                "bundles/Main.js",
                "images/favicon.ico",
                "images/nodejs-logo.png",
                "scripts/GreetingBuilder.js",
                "scripts/Main.js",
                "styles/General.css",
                "styles/Main.css"
            ] )
        } )
    } )
} )
