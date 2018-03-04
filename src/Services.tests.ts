import * as Glob from "globby"
import * as AWS from "aws-sdk"

import { HTTP } from "lymph-service"

import * as Services from "./Services"

import { removeAllJSFiles } from "./Utils"
import { ListObjectsV2Request } from "aws-sdk/clients/s3"

const source_dir = "src/samples/services"

const bundle_config = {
    namespace: "lymph",
    buildDir: "build/services",
    sourceDir: source_dir,
    region: "us-east-1"
}

const services = [
    "src/samples/services/hello-commands.ts",
    "src/samples/services/hello-queries.ts"
]

jest.setTimeout( 10000 )

afterAll( removeAllJSFiles( source_dir ) )

test( "detecting services", function () {
    return Services.detect( bundle_config ).then( function ( detected_services ) {
        expect( detected_services.sort() ).toEqual( services )
    } )
} )

test( "compiling services to separate build directory", function () {
    return Services.compile( bundle_config )( services ).then( function () {
        return Glob( bundle_config.buildDir + "/pre/**/*.js" ).then( function ( files: string[] ) {
            expect( files.sort() ).toEqual( [
                "build/services/pre/common/Lambda.js",
                "build/services/pre/hello-commands.js",
                "build/services/pre/hello-queries.js",
            ] )
        } )
    } )
} )

test( "bundling services to a single js file", function () {
    return Services.bundle( bundle_config )( services ).then( function () {
        return Glob( bundle_config.buildDir + "/*.js" ).then( function ( files: string[] ) {
            expect( files.sort() ).toEqual( [
                "build/services/hello-commands.js",
                "build/services/hello-queries.js",
            ] )
        } )
    } )
} )

test( "archive services into zip files", function () {
    return Services.archive( bundle_config )( services ).then( function () {
        return Glob( bundle_config.buildDir + "/*.zip" ).then( function ( files: string[] ) {
            expect( files.sort() ).toEqual( [
                "build/services/lymph--hello-commands.zip",
                "build/services/lymph--hello-queries.zip",
            ] )
        } )
    } )
} )

test( "upload service bundles to s3", function () {
    const S3 = new AWS.S3( { region: bundle_config.region } )
    const time_stamp = new Date().getTime() - 180000 // 2 minute buffer

    return Services.uploadFunction( bundle_config )( services ).then( function () {
        const params: ListObjectsV2Request = { Bucket: "lymph-artifacts" }

        return S3.listObjectsV2( params ).promise().then( function ( objects ) {
            const { Key, LastModified } = objects.Contents[ 0 ]

            expect( Key ).toEqual( "lymph--hello-commands.zip" )
            expect( new Date( LastModified ).getTime() )
                .toBeLessThanOrEqual( time_stamp )
        } )
    } )
} )

test( "updating and publishing function", function () {
    const lambda = new AWS.Lambda( { region: bundle_config.region } )

    const invoke_options = {
        FunctionName: "lymph--hello-queries"
    }

    return lambda.getFunction( invoke_options ).promise().then( function ( prev_func_info ) {
        return Services.updateFunction( bundle_config )( services ).then( function () {
            return lambda.getFunction( invoke_options ).promise().then( function ( next_func_info ) {
                expect( prev_func_info ).not.toEqual( next_func_info )
            } )
        } )
    } )
} )

test( "updating and publishing function", function () {
    const lambda = new AWS.Lambda( { region: bundle_config.region } )

    const invoke_options = {
        FunctionName: "lymph--hello-queries"
    }

    return lambda.listVersionsByFunction( invoke_options ).promise().then( function ( response ) {
        const prev_finger_prints = response.Versions.map( r => Object.assign( {}, {
            [ r.Version ]: r.CodeSha256
        } ) )

        return Services.publishFunction( bundle_config )( services ).then( function () {
            return lambda.listVersionsByFunction( invoke_options ).promise().then( function ( response ) {
                const next_finger_prints = response.Versions.map( r => Object.assign( {}, {
                    [ r.Version ]: r.CodeSha256
                } ) )

                expect( next_finger_prints.length ).toBeGreaterThan( prev_finger_prints.length )
            } )
        } )
    } )
} )
