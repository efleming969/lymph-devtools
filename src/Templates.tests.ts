import * as Templates from "./Templates"

describe( "render", function () {
    test( "function calls", function () {
        expect( Templates.render( '@module("modules/home")', { dev: true } ) )
            .toEqual( '<script type="module" src="modules/home"></script>' )
    } )
} )
