import * as FS from "fs-extra"
import * as Path from "path"
import * as Glob from "globby"

import { multiline } from "./Utils"

export type TemplateScript = {
    name: string,
    local: string,
    remote: string
}

export type TemplateConfig = {
    name: string,
    dev: boolean,
    title: string,
    styles: string[],
    scripts: TemplateScript[],
    modules: string[]
}

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

const renderStyle = style => `<link rel="stylesheet" href="${style}">`

const renderModule = is_dev => function ( path ) {
    const type = is_dev ? "module" : "application/javascript"
    return `<script type="${type}" src="${path}"></script>`
}

const renderScript = is_dev => function ( script: TemplateScript ) {
    const path = is_dev ? script.local : script.remote
    return `<script type="application/javascript" src="${path}"></script>`
}

export const render = function ( config: TemplateConfig ) {
    return multiline`
        | <!DOCTYPE html>

        | <html lang="en">

        | <head>
        |     <meta charset="UTF-8">
        |     <meta http-equiv="x-ua-compatible" content="ie=edge">
        |     <meta name="viewport" content="width=device-width, initial-scale=1">
        |     <title>${config.title}</title>

        |     ${ config.styles.map( renderStyle ).join( "" ) }

        |     ${ config.scripts.map( renderScript( config.dev ) ).join( "" )}
        |     ${ config.modules.map( renderModule( config.dev ) ).join( "" )}
        | </head>

        | <body></body>

        | </html>
    `
}

export const detect = function ( source_dir: string ): Promise<TemplateConfig[]> {
    const config_file_pattern = Path.join( source_dir, "*.json" )

    return Glob( config_file_pattern ).then( function ( config_file_paths ) {
        const readFilePromises = config_file_paths.map( function ( config_file_path ) {
            return FS.readFile( config_file_path, "utf8" )
                .then( config_string => JSON.parse( config_string ) as TemplateConfig )
        } )

        return Promise.all( readFilePromises )
    } )
}
