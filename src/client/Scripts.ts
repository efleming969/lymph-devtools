import * as Path from "path"
import * as Webpack from "webpack"

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
    console.log( "Compiling module scripts" )
    console.log( "==================================================" )

    const module_source_dir = module_config.name === "_"
        ? Path.join( config.source, "modules" )
        : Path.join( config.source, "modules", module_config.name )

    const module_target_dir = module_config.name === "_"
        ? Path.join( config.target )
        : Path.join( config.target, module_config.name )

    const webpack_config = {
        name: module_config.name,
        entry: Path.join( module_source_dir, "index.ts" ),
        mode: "development",
        output: {
            path: module_target_dir,
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

