import * as Main from "./Main.js"

describe( "main", function () {
    it( "returns a foo string", function () {
        expect( Main.foo() ).toEqual( "foo" )
    } )
} )