import { execFile, execFileSync, execSync } from "child_process"
import { Lambda } from "aws-sdk"

const FS = require( "fs-extra" )
const Path = require( "path" )
const Archiver = require( "archiver" )

const cwd = process.cwd()
const source_dir = Path.join( cwd, "src", "samples", "services" )
const build_dir = Path.join( cwd, "build", "services" )
const npm_bin = Path.join( cwd, "node_modules", ".bin" )
const module_files = FS.readdirSync( source_dir ).filter( file => file.endsWith( ".ts" ) )
const namespace = "braintrustops"

const zipModule = function ( module_name ) {
    const archive = Archiver( "zip" )

    return new Promise( function ( resolve, reject ) {
        const output = FS.createWriteStream(
            Path.join( build_dir, `${ module_name }.zip` ) )

        archive.on( "error", function ( err ) {
            reject( err )
        } )

        output.on( "close", function () {
            resolve()
        } )

        archive.directory( Path.join( build_dir, module_name ), module_name )

        archive.pipe( output )
        archive.finalize()
    } )
}

const updateFunction = function ( module_name ) {
    const lambda = new Lambda( { region: "us-east-1" } )
    const function_name = `${ namespace }--${ module_name }`

    return lambda.updateFunctionCode( {
        FunctionName: function_name,
        S3Bucket: `${ namespace }-artifacts`,
        S3Key: function_name
    } ).promise()
}

module_files.forEach( function ( module_file ) {
    const module_name = module_file.replace( ".ts", "" )

    const module_build_dir = Path.join( build_dir, module_name )
    const module_index_file = Path.join( source_dir, module_file )
    const tsc_options = [ "--outDir", module_build_dir, module_index_file ]

    execFile( Path.join( npm_bin, "tsc" ), tsc_options, function ( err ) {
        console.log( "compiling done" )
        zipModule( module_name ).then( function () {
            console.log( "done zipping" )
        } )
    } )
} )

