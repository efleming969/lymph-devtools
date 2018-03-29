import * as FS from "fs-extra"

import * as Scripts from "./Scripts"
import * as Styles from "./Styles"
import * as Templates from "./Templates"
import * as Bundles from "./Bundles"
import * as Statics from "./Statics"
import * as S3 from "./S3"
import * as AWS from "aws-sdk"

export type Config = {
    source: string,
    target: string,
    bundles: string[]
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

export const deploy = function ( source: string, target: string, region: string ) {
    return S3.put( source, target, region )
        .then( () => S3.clean( source, target, region ) )
}

export const build = function ( config: Config ) {
    return FS.remove( config.target ).then( () => Promise.all( [
        Statics.build( config ),
        Styles.build( config ),
        Templates.build( config ),
        Scripts.build( config )
            .then( () => Bundles.build( config ) )
    ] ) )
}

