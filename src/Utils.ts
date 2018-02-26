import { root } from "postcss"

const FS = require( "fs" )
const Path = require( "path" )

const walk = function ( dir, done ) {
    let results = []
    FS.readdir( dir, function ( err, list ) {
        if ( err ) return done( err )
        let pending = list.length
        if ( !pending ) return done( null, results )
        list.forEach( function ( file ) {
            file = Path.resolve( dir, file )
            FS.stat( file, function ( err, stat ) {
                if ( stat && stat.isDirectory() ) {
                    walk( file, function ( err, res ) {
                        results = results.concat( res )
                        if ( !--pending ) done( null, results )
                    } )
                } else {
                    results.push( file )
                    if ( !--pending ) done( null, results )
                }
            } )
        } )
    } )
}

export const recursiveReadDir = function ( root_dir ) {
    return new Promise( function ( res, rej ) {
        walk( root_dir, function ( err, files ) {
            if ( err ) rej( err )
            res( files )
        } )
    } )
}
