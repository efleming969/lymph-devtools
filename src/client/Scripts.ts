import * as Typescript from "typescript"
import * as Path from "path"
import * as Glob from "globby"
import * as FS from "fs-extra"
import * as Webpack from "webpack"

import { Config } from "./index"

export type ScriptOptions = {
    name: string,
    directory: string,
    dependencies: Map<string, string>
}

export const compileDependencies = function ( config ) {
    console.log( "" )
    console.log( "Compiling dependencies" )
    console.log( "==================================================" )

    const dependencies_dir = Path.join( config.target, "assets", "scripts" )

    const dependency_builds = Object.keys( config.dependencies )
        .map( function ( dependency_name ) {
            const dll_options = {
                name: dependency_name,
                entry: config.dependencies[ dependency_name ],
                mode: "development",
                output: {
                    path: dependencies_dir,
                    filename: `${ dependency_name }.js`,
                    library: dependency_name
                },
                plugins: [
                    new Webpack.DllPlugin( {
                        name: dependency_name,
                        path: Path.join( dependencies_dir, `${ dependency_name }.json` )
                    } )
                ]
            }

            return new Promise( function ( resolve, reject ) {
                Webpack( dll_options, function ( err, results ) {
                    if ( err ) {
                        reject( err )
                    }
                    else {
                        console.log( results.toString() )
                        resolve( config.dependencies )
                    }
                } )
            } )
        } )

    return Promise.all( dependency_builds ).then( () => config )
}

export const compile = ( config ) => function ( module_config ) {
    console.log( "" )
    console.log( "Compiling module script" )
    console.log( "==================================================" )

    const webpack_config = {
        name: module_config.name,
        entry: Path.join( config.source, "modules", module_config.name, "index.ts" ),
        mode: "development",
        output: {
            path: Path.join( config.target, module_config.name ),
            filename: "index.js"
        },
        module: {
            rules: [ {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                    transpileOnly: true
                }
            } ]
        },
        resolve: {
            extensions: [ ".ts", ".tsx" ]
        },
        plugins: [
            new Webpack.DllReferencePlugin( {
                manifest: Path.join( config.target, "assets", "scripts", `${ module_config.dependencies }.json` )
            } )
        ]
    }

    return new Promise( function ( resolve, reject ) {
        Webpack( webpack_config, function ( err, results ) {
            if ( err ) {
                reject( err )
            }
            else {
                console.log( results.toString() )
                resolve( module_config )
            }
        } )
    } )
}

// export const render = function ( config ) {
//     const compile_options = {
//         noEmitOnError: true,
//         noImplicitAny: false,
//         target: Typescript.ScriptTarget.ES2015,
//         module: Typescript.ModuleKind.CommonJS,
//         moduleResolution: Typescript.ModuleResolutionKind.NodeJs,
//         isolatedModules: true
//     }
//
//     const module_file = Path.join( config.directory, "src", "scripts", `${ config.name }.js` )
//     const program = Typescript.createProgram( [ module_file ], compile_options )
//
//     return new Promise( function ( resolve, reject ) {
//         const emitResult = program.emit()
//
//         const allDiagnostics = Typescript.getPreEmitDiagnostics( program )
//             .concat( emitResult.diagnostics )
//
//         const results = allDiagnostics.map( function ( diagnostic ) {
//             if ( diagnostic.file ) {
//                 let { line, character } =
//                     diagnostic.file.getLineAndCharacterOfPosition( diagnostic.start )
//
//                 let message =
//                     Typescript.flattenDiagnosticMessageText( diagnostic.messageText, '\n' )
//
//                 return `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
//             }
//             else {
//                 return `${Typescript.flattenDiagnosticMessageText( diagnostic.messageText, '\n' )}`
//             }
//         } )
//
//         results.length > 0 ? reject( results ) : resolve()
//     } )
// }

// export const compile = ( config: Config ) => function ( typescript_files: string[] ): Promise<string[]> {
//     const compile_options = {
//         noEmitOnError: true,
//         noImplicitAny: false,
//         target: Typescript.ScriptTarget.ES2015,
//         module: Typescript.ModuleKind.ES2015,
//         moduleResolution: Typescript.ModuleResolutionKind.NodeJs,
//         outDir: Path.join( config.target, "scripts" )
//     }
//
//     const program = Typescript.createProgram( typescript_files, compile_options )
//
//     return new Promise( function ( resolve, reject ) {
//         const emitResult = program.emit()
//
//         const allDiagnostics = Typescript.getPreEmitDiagnostics( program )
//             .concat( emitResult.diagnostics )
//
//         const results = allDiagnostics.map( function ( diagnostic ) {
//             if ( diagnostic.file ) {
//                 let { line, character } =
//                     diagnostic.file.getLineAndCharacterOfPosition( diagnostic.start )
//
//                 let message =
//                     Typescript.flattenDiagnosticMessageText( diagnostic.messageText, '\n' )
//
//                 return `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
//             }
//             else {
//                 return `${Typescript.flattenDiagnosticMessageText( diagnostic.messageText, '\n' )}`
//             }
//         } )
//
//         results.length > 0 ? reject( results ) : resolve( typescript_files )
//     } )
// }

const filterOutTests = function ( files: string[] ): string[] {
    return files.filter( file => !file.endsWith( "tests.ts" ) )
}

export const build = function ( config: Config ) {
    const typescript_file_pattern = Path.join( config.source, "scripts", "**", "*.ts" )

    return FS.ensureDir( Path.join( config.target, "scripts" ) )
        .then( () => Glob( typescript_file_pattern ) )
        .then( filterOutTests )
        .then( compile( config ) )
        .then( () => config )
}
