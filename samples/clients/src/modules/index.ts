import { render, h } from "preact"

import Navigation from "./Navigation"

document.addEventListener( "DOMContentLoaded", function () {
    render( Navigation(), document.getElementById( "content" ) )
} )
