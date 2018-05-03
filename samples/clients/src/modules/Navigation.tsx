import { h } from "preact"

const pages = [
    { href: "/", name: "Home" },
    { href: "/login", name: "Login" },
    { href: "/dashboard", name: "Dashboard" }
]

const link = ( l ) => <a href={ l.href }>{ l.name }</a>

export default () => <nav>{ pages.map( link ) }</nav>