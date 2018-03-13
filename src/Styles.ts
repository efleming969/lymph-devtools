import * as FS from "fs-extra"
import * as Path from "path"
import * as Glob from "globby"
import * as PostCSS from "postcss"

import { Module } from "./Clients"
import { createHash, createHashFromString } from "./Utils"

export type Style = {
    source: string,
    target: string
}

export const stream = function ( style: Style ) {
    const post_css_config = { from: style.source, to: style.target }

    return FS.readFile( style.source, "utf8" )
        .then( css => PostCSS( [] ).process( css, post_css_config ) )
        .then( result => result.css )
}

export const process = function ( style: Style ) {
    const post_css_config = { from: style.source, to: style.target }
    const target_dir = Path.dirname( style.target )
    const target_file_name = Path.basename( style.target, ".css" )

    return FS.ensureDir( target_dir )
        .then( () => FS.readFile( style.source, "utf8" ) )
        .then( css => PostCSS( [] ).process( css, post_css_config ) )
        .then( function ( result ) {
            const hash = createHashFromString( result.css )
            const new_name = Path.join( target_dir, `${ target_file_name }.${ hash }.css` )
            return FS.writeFile( new_name, result.css ).then(
                () => Object.assign( {}, style, { target: new_name } ) )
        } )
}

export const compile = function ( modules: Module[] ) {
    return Promise.all( modules.map( function ( module ) {
        return Promise.all( module.styles.map( process ) ).then( function ( styles ) {
            return Object.assign( {}, module, { styles: styles } )
        } )
    } ) )
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
