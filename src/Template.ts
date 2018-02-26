import * as FS from "fs-extra"
import * as Path from "path"
import * as Glob from "globby"

const helpers = {
    module: function ( ctx, module_uri ) {
        const type = ctx.dev ? "module" : "application/javascript"
        const src = ctx.dev ? module_uri : module_uri + ".js"
        return `<script type="${type}" src="${src}"></script>`
    }
}

export const render = function ( template_string: string, context: any ) {
    return template_string.replace( /@([a-zA-Z\.]*)\((.*)\)/g, function ( _, name, args ) {
        try {
            const fn = `return helpers.${ name }( ctx, ${ args })`
            return new Function( "helpers", "ctx", fn ).apply( null, [ helpers, context ] )
        } catch ( e ) {
            return ''
        }
    } )
}

export const buildTemplates = function ( source: string, target: string ) {
    const html_files_pattern = Path.join( source, "**", "*.html" )

    return Glob( html_files_pattern ).then( function ( files ) {
        return Promise.all( files.map( function ( file ) {
            const file_name = Path.basename( file )
            return FS.readFile( file, "utf8" ).then( function ( template ) {
                const rendered_template = render( template, { dev: false } )
                const target_file = Path.join( target, file_name )
                return FS.writeFile( target_file, rendered_template, "utf8" )
            } )
        } ) )
    } )
}
