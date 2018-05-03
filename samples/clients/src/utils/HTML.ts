import * as Ultradom from "ultradom"

export const h = function ( name, attributes, ...children ) {
    return typeof name === "function"
        ? name( attributes, children )
        : Ultradom.h( name, attributes, children )
}

export const h2 = ( text ) => h( "h2", {}, text )