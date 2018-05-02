import { render, h } from "preact"

document.addEventListener( "DOMContentLoaded", function () {
    const links = h( "ul", {}, [
        h( "li", {}, h( "a", { href: "/dashboard" }, "Dashboard" ) ),
        h( "li", {}, h( "a", { href: "/login" }, "Login" ) )
    ] )

    render( links, document.getElementById( "content" ) )
} )
