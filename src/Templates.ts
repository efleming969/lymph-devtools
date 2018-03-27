import * as Pug from "pug"
import * as FS from "fs-extra"
import * as Path from "path"

import { Module, ModuleScript, Config } from "./Clients"

export const render = function ( template_source: string ): Promise<string> {
    return Promise.resolve( "" )
}

// export const compile = ( config: Config ) => function ( module: Module ): Promise<Module> {
//     const html_file = Path.join( config.target, module.name + ".html" )
//     const html_content = render( config )( module )
//
//     return FS.writeFile( html_file, html_content, "utf8" )
// }
