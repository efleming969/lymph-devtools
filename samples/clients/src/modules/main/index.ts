import * as HelloWorld from "../../widgets/HelloWorld"
import { render } from "preact"

document.addEventListener( "DOMContentLoaded", function () {
    render( HelloWorld.message( "world" ), document.getElementById( "content" ) )
} )
