import { execFile } from "child_process"
import { Lambda, S3 } from "aws-sdk"

const FS = require( "fs" )
const Path = require( "path" )
const Archiver = require( "archiver" )

const cwd = process.cwd()
const npm_bin = Path.join( cwd, "node_modules", ".bin" )

export const zipModule = config => function ( module_file ) {
    const module_name = module_file.replace( ".ts", "" )
    const archive = Archiver( "zip" )
    const artifact_file = `${ config.namespace }--${ module_name }.zip`

    return new Promise( function ( resolve, reject ) {
        const output = FS.createWriteStream(
            Path.join( cwd, config.buildDir, artifact_file ) )

        archive.on( "error", function ( err ) {
            reject( err )
        } )

        output.on( "close", function () {
            resolve( module_name )
        } )

        archive.directory( Path.join( cwd, config.buildDir, module_name ), "" )

        archive.pipe( output )
        archive.finalize()
    } )
}

export const uploadFunction = config => function ( module_file ) {
    const module_name = module_file.replace( ".ts", "" )
    const s3 = new S3( { region: config.region } )
    const function_name = `${ config.namespace }--${ module_name }`

    return new Promise( function ( res, rej ) {
        FS.readFile( `${ config.buildDir }/${ function_name }.zip`, function ( e, buffer ) {

            const put_config = {
                Body: buffer,
                Bucket: `${ config.namespace }-artifacts`,
                Key: `${ function_name }.zip`
            }

            return s3.putObject( put_config, function ( e, data ) {
                if ( e ) rej( e )
                res( module_file )
            } )
        } )
    } )
}

export const updateFunction = config => function ( module_file ) {
    const module_name = module_file.replace( ".ts", "" )
    const lambda = new Lambda( { region: config.region } )
    const function_name = `${ config.namespace }--${ module_name }`

    return new Promise( function ( res, rej ) {
        const update_config = {
            FunctionName: function_name,
            S3Bucket: `${ config.namespace }-artifacts`,
            S3Key: `${ function_name }.zip`
        }

        lambda.updateFunctionCode( update_config, function ( e, data ) {
            if ( e ) rej( e )
            res( data )
        } )
    } )
}

export const compileModule = config => function ( module_file ) {
    const module_name = module_file.replace( ".ts", "" )

    const build_dir = Path.join( cwd, config.buildDir, module_name )
    const index_file = Path.join( cwd, config.sourceDir, module_file )
    const tsc_options = [ "--outDir", build_dir, index_file ]

    return new Promise( function ( res, rej ) {
        execFile( Path.join( npm_bin, "tsc" ), tsc_options, function ( err, stdout, stderr ) {
            if ( err ) rej( err )
            res( module_file )
        } )
    } )
}

export const getModules = config => new Promise( function ( res, rej ) {
    FS.readdir( config.sourceDir, function ( e, files ) {
        if ( e ) rej( e )
        res( files.filter( f => f.endsWith( ".ts" ) ) )
    } )
} )

const promiseAll = fn => list => Promise.all( list.map( fn ) )

export const build = function ( config ) {
    return getModules( config )
        .then( promiseAll( compileModule( config ) ) )
        .then( promiseAll( zipModule( config ) ) )
        .then( promiseAll( uploadFunction( config ) ) )
        .then( promiseAll( updateFunction( config ) ) )
        .then( output => console.dir( output ) )
        .catch( e => console.log( e ) )
}

