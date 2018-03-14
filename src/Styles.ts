import * as FS from "fs-extra"
import * as Path from "path"
import * as Glob from "globby"
import * as PostCSS from "postcss"

import { Module, Config } from "./Clients"
import { createHash, createHashFromString } from "./Utils"

export const stream = function ( style: string ) {
    const post_css_config = { from: style, to: style }

    return FS.readFile( style, "utf8" )
        .then( css => PostCSS( [] ).process( css, post_css_config ) )
        .then( result => result.css )
}

export const process = ( config: Config ) => function ( style: string ) {
    const style_source = Path.join( config.source, style )
    const style_target = Path.join( config.target, style )

    const post_css_config = { from: style_source, to: style_target }
    const target_dir = Path.dirname( style_target )

    return FS.ensureDir( target_dir )
        .then( () => FS.readFile( style_source, "utf8" ) )
        .then( css => PostCSS( [] ).process( css, post_css_config ) )
        .then( result => FS.writeFile( style_target, result.css ) )
}

export const compile = ( config: Config ) => function ( module: Module ) {
    return Promise.all( module.styles.map( process( config ) ) )
        .then( () => module )
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
