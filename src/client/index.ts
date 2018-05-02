import * as FS from "fs-extra"
import * as Path from "path"
import * as Globby from "globby"

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
    const assets_source_dir = Path.join( config.source, "images" )
    const assets_target_dir = Path.join( config.target, "images" )

    return FS.copy( assets_source_dir, assets_target_dir ).then( () => config )
}

export const ensureDirs = function ( config ) {
    const dirs = [ "assets/styles", "assets/scripts", "assets/images" ]
    const modules_dir = Path.join( config.source, "modules" )

    return FS.readdir( modules_dir ).then( function ( all_files_in_modules ) {
        const modules = all_files_in_modules
            .map( x => Path.join( modules_dir, x ) )
            .filter( x => FS.lstatSync( x ).isDirectory() )
            .map( x => Path.basename( x ) )

        const config_with_modules = Object.assign( {}, config, {
            modules: modules.concat( "_" )
        } )

        return Promise.all( dirs.concat( modules ).map( function ( dir_name ) {
            return FS.ensureDir( Path.join( config.target, dir_name ) )
        } ) ).then( () => config_with_modules )
    } )
}
