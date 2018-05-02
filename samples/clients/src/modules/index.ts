import { render, h } from "preact"

document.addEventListener( "DOMContentLoaded", function () {
    render( h( "a", { href: "/main" }, "Main" ), document.getElementById( "content" ) )
} )
