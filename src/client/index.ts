import * as FS from "fs-extra"
import * as Path from "path"

import * as Scripts from "./Scripts"
import * as Styles from "./Styles"
import * as S3 from "./S3"

// need an unused import to solve type checker issues
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/#Known_Limitations
import * as AWS from "aws-sdk"

export type Config = {
    source: string,
    target: string,
    bundles: string[]
}

export const deploy = function ( source: string, target: string, region: string ) {
    return S3.put( source, target, region )
        .then( () => S3.clean( source, target, region ) )
}

export const copyAssets = function ( config ) {
    const assets_source_dir = Path.join( config.source, "assets" )
    const assets_target_dir = Path.join( config.target, "assets" )

    return FS.copy( assets_source_dir, assets_target_dir ).then( () => config )
}

export const build = function ( config: Config ) {
    return ensureDirs( config )
        .then( copyAssets )
        .then( Scripts.compileDependencies )
        .then( Styles.compileDependencies )
}

export const ensureDirs = function ( config ) {
    const dirs = [ "assets/styles", "assets/scripts" ]
    const modules_dir = Path.join( config.source, "modules" )

    return FS.readdir( modules_dir ).then( function ( modules ) {
        const config_with_modules = Object.assign( {}, config, { modules } )
        return Promise.all( dirs.concat( modules ).map( function ( dir_name ) {
            return FS.ensureDir( Path.join( config.target, dir_name ) )
        } ) ).then( () => config_with_modules )
    } )
}
