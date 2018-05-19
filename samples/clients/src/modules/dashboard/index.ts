import * as HelloWorld from "../../widgets/preact/HelloWorld"
import { render } from "preact"

document.addEventListener( "DOMContentLoaded", function () {
    render( HelloWorld.message( "world" ), document.getElementById( "content" ) )
} )
