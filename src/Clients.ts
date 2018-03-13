import * as FS from "fs-extra"
import * as Path from "path"
import * as AWS from "aws-sdk"
import * as Glob from "globby"
import * as Mime from "mime"

import * as Scripts from "./Scripts"
import * as Styles from "./Styles"
import * as Templates from "./Templates"
import { Style } from "./Styles"

export type Config = {
    source: string,
    target: string,
    globals: any
}

export type Script = {
    name: string,
    iife: string,
    local: string,
    remote: string
}

export type MainScript = {
    source: string,
    target: string
}

export type Module = {
    name: string,
    title: string,
    main: MainScript,
    styles: Style[],
    scripts: Script[],
    globals: any
}

const mapToStyle = ( source_dir: string, target_dir: string ) => function ( style: string ): Style {
    return {
        source: Path.join( source_dir, style ),
        target: Path.join( target_dir, style )
    }
}

export const configure = function ( source_dir: string, target_dir: string, globals: any ): Promise<Module[]> {
    const config_file_pattern = Path.join( source_dir, "*.json" )

    return Glob( config_file_pattern ).then( function ( module_config_files ) {
        return Promise.all( module_config_files.map( function ( module_config_file ) {
            return FS.readFile( module_config_file, "utf8" )
                .then( raw_config => JSON.parse( raw_config ) )
                .then( config => Object.assign( {}, {
                    name: Path.basename( module_config_file, ".json" ),
                    title: config.title,
                    main: {
                        source: Path.join( source_dir, config.main + ".ts" ),
                        target: Path.join( target_dir, config.main + ".js" )
                    },
                    styles: config.styles.map( mapToStyle( source_dir, target_dir ) ),
                    scripts: config.scripts || {},
                    globals: globals
                } ) )
        } ) )
    } )
}

export const buildStatics = function ( config: Config ) {
    const source_dir = Path.join( config.source, "statics" )
    const target_dir = Path.join( config.target, "statics" )

    return FS.copy( source_dir, target_dir )
        .then( () => config )
}

export const build = function ( source: string, target: string, globals: any ) {
    return configure( source, target, globals )
        .then( Scripts.compile )
        .then( Scripts.bundle )
        .then( Scripts.revision )
        .then( Styles.compile )
        .then( Templates.build( false ) ) // needs to be last for incorporating file versions
        .then( ( modules ) => console.log( JSON.stringify( modules ) ) )
        .catch( ( error ) => console.log( error ) )
}

export const deploy = function ( source: string, target: string, region: string ) {
    const s3 = new AWS.S3( { region } )

    return Glob( source ).then( function ( files ) {
        return Promise.all( files.map( function ( file ) {
            return FS.readFile( file ).then( function ( buffer ) {
                const put_config = {
                    Body: buffer,
                    Bucket: target,
                    Key: file.replace( source + "/", "" ),
                    ContentType: Mime.getType( file ) // content-type is needed since S3 is bad at guessing mime types
                }
                return s3.putObject( put_config ).promise()
            } )
        } ) )
    } )
}
