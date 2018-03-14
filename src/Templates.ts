import * as FS from "fs-extra"
import * as Path from "path"

import { multiline } from "./Utils"
import { Module, ModuleScript, Config } from "./Clients"

const renderStyle = src => `<link rel="stylesheet" href="${ src }">`

const renderModule = is_dev => function ( path ) {
    const type = is_dev ? "module" : "application/javascript"
    const src = path + (is_dev ? "" : ".js")
    return `<script type="${type}" src="scripts/${src}" defer></script>`
}

const renderScript = is_dev => function ( script: ModuleScript ) {
    const path = is_dev ? script.local : script.remote
    return `<script type="application/javascript" src="${path}"></script>`
}

export const render = ( config: Config ) => function ( module: Module ) {
    return multiline`
        | <!DOCTYPE html>

        | <html lang="en">

        | <head>
        |     <meta charset="UTF-8">
        |     <meta http-equiv="x-ua-compatible" content="ie=edge">
        |     <meta name="viewport" content="width=device-width, initial-scale=1">
        |     <title>${ module.title }</title>
        |     <link rel="icon" href="statics/images/favicon.ico">

        |     ${ module.styles.map( renderStyle ).join( "\n" ) }

        |     ${ module.scripts.map( renderScript( config.dev ) ).join( "\n" ) }
        |     ${ renderModule( config.dev )( module.name ) }
        | </head>

        | <body></body>

        | </html>
    `
}

export const compile = ( config: Config ) => function ( module: Module ): Promise<Module> {
    const html_file = Path.join( config.target, module.name + ".html" )
    const html_content = render( config )( module )

    return FS.writeFile( html_file, html_content, "utf8" )
}
