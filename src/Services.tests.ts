import * as Glob from "globby"
import * as AWS from "aws-sdk"

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

afterAll( removeAllJSFiles( source_dir ) )

test( "detecting services", function () {
    return Services.detect( bundle_config ).then( function ( detected_services ) {
        expect( detected_services.sort() ).toEqual( services )
    } )
} )

test( "compiling services to separate build directories", function () {
    return Services.compile( bundle_config, services ).then( function () {
        return Glob( bundle_config.buildDir + "/**/*.js" ).then( function ( files: string[] ) {
            expect( files.sort() ).toEqual( [
                "build/services/hello-commands/common/Lambda.js",
                "build/services/hello-commands/hello-commands.js",
                "build/services/hello-queries/hello-queries.js",
            ] )
        } )
    } )
} )

test( "bundling services into zip files", function () {
    return Services.bundle( bundle_config, services ).then( function () {
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
    const time_stamp = new Date().getTime() - 120000 // 2 minute buffer

    return Services.uploadFunction( bundle_config, services ).then( function () {
        const params: ListObjectsV2Request = { Bucket: "lymph-artifacts" }

        return S3.listObjectsV2( params ).promise().then( function ( objects ) {
            const { Key, LastModified } = objects.Contents[ 0 ]

            expect( Key ).toEqual( "lymph--hello-commands.zip" )
            expect( new Date( LastModified ).getTime() )
                .toBeLessThanOrEqual( time_stamp )
        } )
    } )
} )

