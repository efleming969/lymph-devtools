import * as Pug from "pug"
import * as FS from "fs-extra"
import * as Path from "path"

import { Module, ModuleScript, Config } from "./Clients"

export type TemplateOptions = {
    name: string,
    directory: string
}

export const render = function ( options: TemplateOptions ) {
    const template_file = Path.join( options.directory, `${ options.name }.pug` )

    return new Promise( function ( resolve, reject ) {
        Pug.renderFile( template_file, options, function ( err, rendered_template ) {
            if ( err ) reject( err )
            else resolve( rendered_template )
        } )
    } )
}

// export const compile = ( config: Config ) => function ( module: Module ): Promise<Module> {
//     const html_file = Path.join( config.target, module.name + ".html" )
//     const html_content = render( config )( module )
//
//     return FS.writeFile( html_file, html_content, "utf8" )
// }
