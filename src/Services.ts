import { Lambda, S3 } from "aws-sdk"

import * as Typescript from "typescript"
import * as Glob from "globby"
import * as FS from "fs-extra"
import * as Path from "path"
import * as Archiver from "archiver"

export type BundleConfig = {
    namespace: string,
    buildDir: string
    sourceDir: string,
    region: string
}

export const uploadFunction = ( config: BundleConfig ) => function ( services: string[] ) {
    return Promise.all( services.map( function ( service_file ) {
        const module_name = Path.basename( service_file, ".ts" )
        const s3 = new S3( { region: config.region } )
        const bundle_name = `${ config.namespace }--${ module_name }`

        console.log( "uploading", bundle_name, "to", `${config.namespace}` )

        FS.readFile( `${ config.buildDir }/${ bundle_name }.zip` )
            .then( function ( buffer ) {
                return {
                    Body: buffer,
                    Bucket: `${ config.namespace }-artifacts`,
                    Key: `${ bundle_name }.zip`
                }
            } ).then( put_config => s3.putObject( put_config ).promise() )
            .then( () => service_file )
    } ) )
}

export const updateFunction = ( config: BundleConfig ) => function ( services: string[] ) {
    return Promise.all( services.map( function ( service_file ) {
        const module_name = Path.basename( service_file, ".ts" )
        const lambda = new Lambda( { region: config.region } )
        const function_name = `${ config.namespace }--${ module_name }`

        const update_config = {
            FunctionName: function_name,
            S3Bucket: `${ config.namespace }-artifacts`,
            S3Key: `${ function_name }.zip`
        }

        console.log( "updating", function_name, "from", config.namespace )

        return lambda.updateFunctionCode( update_config ).promise()
    } ) )
}

export const publishFunction = ( config: BundleConfig ) => function ( services: string[] ) {
    return Promise.all( services.map( function ( service_file ) {
        const module_name = Path.basename( service_file, ".ts" )

        const lambda = new Lambda( { region: config.region } )
        const function_name = `${ config.namespace }--${ module_name }`

        const update_config = {
            FunctionName: function_name
        }

        console.log( "publishing", function_name, config.namespace )

        return lambda.publishVersion( update_config ).promise()
    } ) )
}

export const detect = function ( config: BundleConfig ): Promise<string[]> {
    return Glob( Path.join( config.sourceDir, "*.ts" ) )
}

export const compile = ( config: BundleConfig ) => function ( services: string[] ): Promise<any> {
    return Promise.all( services.map( function ( service_file ) {
        const service_name = Path.basename( service_file, ".ts" )

        const compile_options = {
            noEmitOnError: true,
            noImplicitAny: false,
            target: Typescript.ScriptTarget.ES2015,
            module: Typescript.ModuleKind.CommonJS,
            moduleResolution: Typescript.ModuleResolutionKind.NodeJs,
            inlineSourceMap: false,
            inlineSources: false,
            outDir: Path.join( config.buildDir, service_name )
        }

        const program = Typescript.createProgram( [ service_file ], compile_options )

        return new Promise( function ( resolve, reject ) {
            const emitResult = program.emit()

            const allDiagnostics = Typescript.getPreEmitDiagnostics( program )
                .concat( emitResult.diagnostics )

            const results = allDiagnostics.map( function ( diagnostic ) {
                if ( diagnostic.file ) {
                    let { line, character } =
                        diagnostic.file.getLineAndCharacterOfPosition( diagnostic.start )

                    let message =
                        Typescript.flattenDiagnosticMessageText( diagnostic.messageText, '\n' )

                    return `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
                }
                else {
                    return `${Typescript.flattenDiagnosticMessageText( diagnostic.messageText, '\n' )}`
                }
            } )

            results.length > 0 ? reject( results ) : resolve( service_file )
        } )
    } ) )
}

export const bundle = ( config: BundleConfig ) => function ( services: string[] ): Promise<any> {
    return Promise.all( services.map( function ( service_file ) {
        const bundle_name = Path.basename( service_file, ".ts" )
        const archive = Archiver( "zip" )
        const archive_file = `${ config.namespace }--${ bundle_name }.zip`

        return new Promise( function ( resolve, reject ) {
            const output = FS.createWriteStream(
                Path.join( config.buildDir, archive_file ) )

            archive.on( "error", function ( err ) {
                reject( err )
            } )

            output.on( "close", function () {
                resolve( service_file )
            } )

            archive.directory( Path.join( config.buildDir, bundle_name ), config.namespace )

            archive.pipe( output )
            archive.finalize()
        } )
    } ) )
}




