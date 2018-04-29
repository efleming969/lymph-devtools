import * as FS from "fs-extra"
import * as Path from "path"
import * as Sass from "sass"

export const compileDependencies = function ( config ) {
    const source_styles_dir = Path.join( config.source, "styles" )
    const target_styles_dir = Path.join( config.target, "styles" )

    console.log( "==================================================" )
    console.log( "Compiling shared styles" )
    console.log( "==================================================" )

    return FS.readdir( source_styles_dir )
        .then( function ( style_files ) {
            return Promise.all( style_files.map( function ( style_file ) {
                const source_file = Path.join( source_styles_dir, style_file )
                const target_file = Path.join(
                    target_styles_dir, style_file.replace( ".scss", ".css" ) )

                return new Promise( function ( resolve, reject ) {
                    console.log( source_file )

                    Sass.render( { file: source_file }, function ( err, rst ) {
                        FS.writeFile( target_file, rst.css, "utf8", function ( err ) {
                            if ( err ) {
                                reject( err )
                            } else {
                                resolve()
                            }
                        } )
                    } )
                } )
            } ) )
        } ).then( () => config )
}

export const compile = ( config ) => function ( module_config ) {
    console.log( "==================================================" )
    console.log( "Compiling module styles" )
    console.log( "==================================================" )

    const source_file = Path.join( config.source, "modules", module_config.name, "index.scss" )
    const target_file = Path.join( config.target, "styles", `${ module_config.name }.css` )

    return new Promise( function ( resolve, reject ) {
        console.log( source_file )

        Sass.render( { file: source_file }, function ( err, rst ) {
            FS.writeFile( target_file, rst.css, "utf8", function ( err ) {
                if ( err ) {
                    reject( err )
                } else {
                    resolve( module_config )
                }
            } )
        } )
    } )
}
