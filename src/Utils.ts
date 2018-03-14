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

