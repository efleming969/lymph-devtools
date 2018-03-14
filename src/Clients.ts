import * as FS from "fs-extra"
import * as Path from "path"
import * as AWS from "aws-sdk"
import * as Glob from "globby"

import * as Scripts from "./Scripts"
import * as Styles from "./Styles"
import * as Templates from "./Templates"

export type Config = {
    dev: boolean,
    source: string,
    target: string
}

export type ModuleScript = {
    name: string,
    iife: string,
    local: string,
    remote: string
}

export type Module = {
    name: string,
    title: string,
    styles: string[],

    scripts: ModuleScript[],
    globals: any
}

/**
 * created this primitive mime lookup, due to an issue with node-mime library
 * and jest's resolver.  Found a discussion https://github.com/kulshekhar/ts-jest/issues/269
 * related to this, but seemed overly complicated for what was needed
 */
const getMimeFromFile = function ( file_path: string ): string {
    const mime_types = {
        ".gif": "image/gif",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".svg": "image/svg+xm",
        ".ico": "image/x-icon",
        ".css": "text/css",
        ".html": "text/html",
        ".js": "application/javascript"
    }

    const file_extension = Path.extname( file_path )

    return mime_types[ file_extension ]
}

export const detectModules = function ( config: Config ): Promise<Module[]> {
    const config_file_pattern = Path.join( config.source, "*.json" )

    return Glob( config_file_pattern ).then( function ( module_config_files ) {
        return Promise.all( module_config_files.map( function ( module_config_file ) {
            return FS.readFile( module_config_file, "utf8" )
                .then( raw_config => JSON.parse( raw_config ) )
                .then( config => Object.assign( {}, {
                    name: Path.basename( module_config_file, ".json" ),
                    title: config.title,
                    styles: config.styles,
                    scripts: config.scripts || [],
                    globals: config.globals || {}
                } ) )
        } ) )
    } )
}

export const copyStatics = function ( config: Config ) {
    const source_dir = Path.join( config.source, "statics" )
    const target_dir = Path.join( config.target, "statics" )

    return FS.copy( source_dir, target_dir ).then( () => config )
}

export const deploy = function ( source: string, target: string, region: string ) {
    const s3 = new AWS.S3( { region } )

    return Glob( source ).then( function ( files ) {
        console.log( "uploading", files )
        return Promise.all( files.map( function ( file ) {
            return FS.readFile( file ).then( function ( buffer ) {
                const put_config = {
                    Body: buffer,
                    Bucket: target,
                    Key: file.replace( source + "/", "" ),
                    ContentType: getMimeFromFile( file ), // content-type is needed since S3 does not guess mime types
                    CacheControl: "no-cache,public,max-age=60"
                }
                console.log( "putting", put_config.Bucket, put_config.Key )
                return s3.putObject( put_config ).promise()
            } )
        } ) )
    } )
}

export const buildModule = ( config: Config ) => function ( module: Module ): Promise<Module> {
    return Promise.resolve( module )
        .then( Scripts.compile( config ) )
        .then( Scripts.bundle( config ) )
        .then( Styles.compile( config ) )
        .then( Templates.compile( config ) )
}

