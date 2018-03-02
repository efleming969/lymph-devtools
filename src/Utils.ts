import * as Path from "path"
import * as Glob from "globby"
import * as FS from "fs-extra"

export const multiline = function ( strings, ...args ) {

    const whitespace = /^\s*|\n\s*$/g
    const find_indent = /^[ \t\r]*\| (.*)$/gm

    return strings.reduce( function ( out, part, i ) {
        if ( args.hasOwnProperty( i ) ) {
            const lines = part.split( '\n' );
            // find indention of the current line
            const indent = lines[ lines.length - 1 ].replace( /[ \t\r]*\| ([ \t\r]*).*$/, '$1' );
            // indent interpolated lines to match
            const tail = (args[ i ] || '').split( '\n' ).join( '\n' + indent );
            return out + part + tail;
        } else {
            return out + part;
        }
    }, '' ).replace( whitespace, '' ).replace( find_indent, '$1' )
}

export const mapObject = function ( fn, object ) {
    return Object.keys( object ).map( key => fn( key, object[ key ] ) )
}

export const removeAllJSFiles = ( dir: string ) => function () {
    const js_pattern = Path.join( dir, "**", "*.js" )

    return Glob( js_pattern ).then( function ( js_files ) {
        return Promise.all( js_files.map( f => FS.remove( f ) ) )
    } )
}

export const selectProps = ( prop_names: string[] ) => function ( original_object: object ) {
    return prop_names.reduce( function ( obj, key ) {
        return Object.assign( {}, obj, original_object[ key ] )
    }, {} )
}


