import * as Pug from "pug"
import * as FS from "fs-extra"
import * as Path from "path"
import * as Glob from "globby"

import { Config } from "./index"

export type TemplateOptions = {
    name: string,
    directory: string
}

export const render = function ( options: TemplateOptions ) {
    const template_file = Path.join( options.directory, "pages", `${ options.name }.pug` )

    console.log( template_file )

    return new Promise( function ( resolve, reject ) {
        Pug.renderFile( template_file, options, function ( err, rendered_template ) {
            if ( err ) reject( err )
            else resolve( rendered_template )
        } )
    } )
}

export const build = function ( config: Config ) {
    const pug_file_pattern = Path.join( config.source, "pages", "**", "*.pug" )

    return Glob( pug_file_pattern ).then( function ( pug_files ) {
        return pug_files.map( function ( pug_file ) {
            const name = Path.basename( pug_file, ".pug" )
            const target_file = Path.join( config.target, `${ name }.html` )
            console.log( `compiling ${ pug_file } to ${ target_file }` )
            const render_options = { name }
            const render_content = Pug.renderFile( pug_file, render_options )

            return FS.writeFile( target_file, render_content )
        } )
    } )
}

