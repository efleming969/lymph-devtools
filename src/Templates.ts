import * as FS from "fs-extra"
import * as Path from "path"
import * as Glob from "globby"

export type Template = {
    source: string,
    target: string
}

const helpers = {
    module: function ( ctx, module_uri ) {
        const type = ctx.dev ? "module" : "application/javascript"
        const src = ctx.dev ? module_uri : module_uri + ".js"
        return `<script type="${type}" src="${src}"></script>`
    }
}

const mapObject = function ( fn, object ) {
    return Object.keys( object ).map( key => fn( key, object[ key ] ) )
}

const renderStyle = style => `
    <link rel="stylesheet" href="${style}">
`

const renderModule = is_dev => function ( path ) {
    const type = is_dev ? "module" : "application/javascript"
    return `<script type="${type}" src="${path}"></script>`
}

const renderScript = is_dev => function ( name, paths ) {
    const path = is_dev ? paths.local : paths.remote
    return `<script type="application/javascript" src="${path}"></script>`
}

export const render = function ( config ) {
    return `
<!DOCTYPE html>

<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${config.title}</title>
    
    ${ config.styles.map( renderStyle ).join( "" ) }
    ${ mapObject( renderScript( config.dev ), config.scripts ).join( "" )}
    ${ config.modules.map( renderModule( config.dev ) ).join( "" )}
</head>

<body></body>

</html>
    `
}

export const renderOld = function ( template_string: string, context: any ) {
    return template_string.replace( /@([a-zA-Z\.]*)\((.*)\)/g, function ( _, name, args ) {
        try {
            const fn = `return helpers.${ name }( ctx, ${ args })`
            return new Function( "helpers", "ctx", fn ).apply( null, [ helpers, context ] )
        } catch ( e ) {
            return ''
        }
    } )
}

export const compile = function ( template: Template ) {
    return FS.readFile( template.source, "utf8" )
        .then( template_string => renderOld( template_string, { dev: false } ) )
        .then( compiled_template => FS.writeFile( template.target, compiled_template, "utf8" ) )
}

const file2Template = ( target: string ) => function ( file: string ): Template {
    return {
        source: file, target: Path.join( target, Path.basename( file ) )
    }
}

export const detect = function ( source: string, target: string ): Promise<Template[]> {
    const html_files_pattern = Path.join( source, "**", "*.html" )

    return FS.ensureDir( target )
        .then( () => Glob( html_files_pattern ) )
        .then( files => files.map( file2Template( target ) ) )
}
