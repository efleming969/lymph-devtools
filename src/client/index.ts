import * as FS from "fs-extra"

import * as Scripts from "./Scripts"
import * as Styles from "./Styles"
import * as Templates from "./Templates"
import * as Bundles from "./Bundles"
import * as Statics from "./Statics"
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

export const build = function ( config: Config ) {
    return FS.remove( config.target ).then( () => Promise.all( [
        Statics.build( config ),
        Styles.build( config ),
        Templates.build( config ),
        Scripts.build( config )
            .then( () => Bundles.build( config ) )
    ] ) )
}

