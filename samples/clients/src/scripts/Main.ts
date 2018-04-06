import GreetingBuilder from "./GreetingBuilder.js"
import * as HelloWorld from "./HelloWorld.js"
import { render } from "preact"

console.log( GreetingBuilder.build() )

document.addEventListener( "DOMContentLoaded", function () {
    render( HelloWorld.message( "world" ), document.getElementById( "content" ) )
} )
