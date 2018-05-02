import { render } from "ultradom"
import * as Main from "./Main"

const renderView = function () {
    if ( document.location.hash === "" ) {
        document.location.hash = "#/"
    }
    else {
        render( <any>Main.view( document.location.hash.slice( 1 ) ), document.body )
    }
}

document.addEventListener( "DOMContentLoaded", function () {
    renderView()
} )

window.addEventListener( "hashchange", function ( e ) {
    renderView()
} )