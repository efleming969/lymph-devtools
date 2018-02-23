import { render } from "./Template"

describe( "render", function () {
    test( "function calls", function () {
        expect( render( '@module("modules/home")', { dev: true } ) )
            .toEqual( '<script type="module" src="modules/home"></script>' )
    } )
} )