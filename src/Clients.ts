import * as FS from "fs-extra"
import * as Path from "path"
import * as AWS from "aws-sdk"
import * as Glob from "globby"
import * as Mime from "mime"

import * as Scripts from "./Scripts"
import * as Styles from "./Styles"
import * as Templates from "./Template"

const cwd = process.cwd()

type Config = {
    source: string,
    target: string
}

export const config = function ( source: string, target: string ) {
    return Promise.resolve( { source, target } )
}

export const buildTemplates = function ( config: Config ) {
    return Templates.buildTemplates( config.source, config.target )
        .then( () => config )
}

export const buildScripts = function ( config: Config ) {
    return Scripts.detectModules( config.source, config.target )
        .then( Scripts.compile )
        .then( Scripts.bundle )
        .then( () => config )
}

export const buildStyles = function ( config: Config ) {
    return Styles.detectStyles( config.source, config.target )
        .then( Styles.compile )
        .then( () => config )
}

export const buildImages = function ( config: Config ) {
    console.log( "copying images", config )

    return FS.copy(
        Path.join( config.source, "images" ),
        Path.join( config.target, "images" ) ).then( () => config )
}

export const deploy = function ( config: Config ) {
    console.log( "deploying clients" )

    const s3 = new AWS.S3( { region: "us-east-1" } )
    const namespace = "braintrustops"

    return Glob( config.target ).then( function ( files ) {
        return Promise.all( files.map( function ( file ) {
            return FS.readFile( file ).then( function ( buffer ) {
                const put_config = {
                    Body: buffer,
                    Bucket: namespace,
                    Key: file.replace( "build/", "" ),
                    ContentType: Mime.getType( file )
                }

                return s3.putObject( put_config ).promise()
            } )
        } ) )
    } )
}
