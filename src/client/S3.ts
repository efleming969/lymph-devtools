import * as AWS from "aws-sdk"
import * as Path from "path"
import * as FS from "fs-extra"
import * as Glob from "globby"

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

export const clean = function ( source: string, target: string, region: string ) {
    const s3 = new AWS.S3( { region } )

    return Promise.all( [
        s3.listObjectsV2( { Bucket: "lymph" } ).promise().then( x => x.Contents.map( y => y.Key ) ),
        Glob( source )
    ] ).then( function ( results ) {
        const [ remote_keys, local_files ] = results
        const local_keys = local_files.map( x => x.replace( source + "/", "" ) )
        const keys_to_delete = remote_keys.filter( x => local_keys.indexOf( x ) === -1 )

        return Promise.all( keys_to_delete.map( function ( key_to_delete ) {
            return s3.deleteObject( {
                Bucket: target,
                Key: key_to_delete
            } ).promise()
        } ) )
    } )
}

export const put = function ( source: string, target: string, region: string ) {
    const s3 = new AWS.S3( { region } )

    return Glob( source ).then( function ( local_files ) {
        return Promise.all( local_files.map( function ( file ) {
            return FS.readFile( file ).then( function ( buffer ) {
                const put_config = {
                    Body: buffer,
                    Bucket: target,
                    Key: file.replace( source + "/", "" ),
                    ContentType: getMimeFromFile( file ), // content-type is needed since S3 does not guess mime types
                    CacheControl: "no-cache,public,max-age=60"
                }
                return s3.putObject( put_config ).promise()
            } )
        } ) )
    } )
}
