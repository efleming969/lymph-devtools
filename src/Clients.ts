import * as FS from "fs-extra"
import * as Path from "path"
import * as AWS from "aws-sdk"
import * as Glob from "globby"
import * as Mime from "mime"

import * as Scripts from "./Scripts"
import * as Styles from "./Styles"
import * as Templates from "./Templates"

const cwd = process.cwd()

type Config = {
    source: string,
    target: string
}

export const configure = function ( source: string, target: string ) {
    return Promise.resolve( { source, target } )
}

const mapToPromises = fn => list => Promise.all( list.map( fn ) )

export const buildTemplates = function ( config: Config ) {
    return Templates.detect( config.source, config.target )
        .then( mapToPromises( Templates.compile ) )
        .then( () => config )
}

export const buildScripts = function ( config: Config ) {
    return Scripts.detect( config.source, config.target )
        .then( Scripts.compile )
        .then( Scripts.bundle )
        .then( () => config )
}

export const buildStyles = function ( config: Config ) {
    return Styles.detect( config.source, config.target )
        .then( Styles.compile )
        .then( () => config )
}

export const buildStatics = function ( config: Config ) {
    const source_dir = Path.join( config.source, "statics" )
    const target_dir = Path.join( config.target, "statics" )

    return FS.copy( source_dir, target_dir )
        .then( () => config )
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
                    ContentType: Mime.getType( file )
                }
                return s3.putObject( put_config ).promise()
            } )
        } ) )
    } )
}
