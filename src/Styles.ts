import * as FS from "fs-extra"
import * as Path from "path"
import * as Glob from "globby"
import * as PostCSS from "postcss"

export type Style = {
    name: string,
    input: string,
    output: string
}

export const stream = function ( style: Style ) {
    const post_css_config = { from: style.input, to: style.output }

    return FS.readFile( style.input, "utf8" )
        .then( css => PostCSS( [] ).process( css, post_css_config ) )
        .then( result => result.css )
}

export const process = function ( style: Style ) {
    const post_css_config = { from: style.input, to: style.output }
    const target_dir = Path.dirname( style.output )

    return FS.ensureDir( target_dir )
        .then( () => FS.readFile( style.input, "utf8" ) )
        .then( css => PostCSS( [] ).process( css, post_css_config ) )
        .then( result => FS.writeFile( style.output, result.css ) )
}

export const compile = function ( styles ) {
    return Promise.all( styles.map( process ) ).then( () => styles )
}

export const detect = function ( source: string, target: string ) {
    const css_file_pattern = Path.join( source, "**", "*.css" )

    return Glob( css_file_pattern ).then( files => files.map( function ( f ) {
        const name = Path.basename( f, ".css" )
        const input = f
        const output = Path.join( target, "styles", name + ".css" )
        return { name, input, output }
    } ) )
}
